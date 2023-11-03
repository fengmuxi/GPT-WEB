import {
  ACCESS_CODE_PREFIX,
  DEFAULT_API_HOST,
  DEFAULT_MODELS,
  OpenaiPath,
  REQUEST_TIMEOUT_MS,
} from "@/app/constant";
import {
  useAccessStore,
  useAppConfig,
  useChatStore,
  useUserStore,
} from "@/app/store";

import { ChatOptions, getHeaders, LLMApi, LLMModel, LLMUsage } from "../api";
import Locale from "../../locales";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";
import { prettyObject } from "@/app/utils/format";
import { getClientConfig } from "@/app/config/client";
import { messageBody, userapi } from "../userapi";
import { getServerSideConfig } from "@/app/config/server";
import md5 from "spark-md5";
import { get } from "http";

export interface OpenAIListModelResponse {
  object: string;
  data: Array<{
    id: string;
    object: string;
    root: string;
  }>;
}

export class ChatGPTApi implements LLMApi {
  private disableListModels = true;
  private serverConfig = getServerSideConfig();
  private validString = (x: string) => x && x.length > 0;

  path(path: string): string {
    let openaiUrl = useAccessStore.getState().openaiUrl;
    const apiPath = "/api/openai";

    if (openaiUrl.length === 0) {
      const isApp = !!getClientConfig()?.isApp;
      openaiUrl = isApp ? DEFAULT_API_HOST : apiPath;
    }
    if (openaiUrl.endsWith("/")) {
      openaiUrl = openaiUrl.slice(0, openaiUrl.length - 1);
    }
    if (!openaiUrl.startsWith("http") && !openaiUrl.startsWith(apiPath)) {
      openaiUrl = "https://" + openaiUrl;
    }
    return [openaiUrl, path].join("/");
  }

  code(): string {
    if (
      useAccessStore.getState().enabledAccessControl() &&
      this.validString(useAccessStore.getState().accessCode)
    ) {
      return md5.hash(useAccessStore.getState().accessCode ?? "").trim();
    }
    return "";
  }

  extractMessage(res: any) {
    return res.choices?.at(0)?.message?.content ?? "";
  }

  async chat(options: ChatOptions) {
    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const getBody = (
      messageType: string,
      messageText: string,
      messageSource: string,
    ) => {
      return {
        messageType: messageType,
        messageText: messageText,
        messageSource: messageSource,
      } as messageBody;
    };

    const modelConfig = {
      ...useAppConfig.getState().modelConfig,
      ...useChatStore.getState().currentSession().mask.modelConfig,
      ...{
        model: options.config.model,
      },
    };

    const requestPayload = {
      messages,
      stream: options.config.stream,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      presence_penalty: modelConfig.presence_penalty,
      frequency_penalty: modelConfig.frequency_penalty,
      top_p: modelConfig.top_p,
    };

    console.log("[Request] openai payload: ", requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(OpenaiPath.ChatPath);
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getHeaders(),
      };

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      if (useAccessStore.getState().auth) {
        userapi.llm.addChatMessage(
          getBody("文字", messages[messages.length - 1].content, "user"),
        );
      }

      if (shouldStream) {
        let responseText = "";
        let finished = false;

        const finish = () => {
          if (!finished) {
            console.log("responseText:" + responseText);
            if (useAccessStore.getState().auth) {
              userapi.llm.addChatMessage(
                getBody("文字", responseText, modelConfig.model),
              );
            }
            options.onFinish(responseText);
            finished = true;
          }
        };

        const code = this.code();
        const config = this.serverConfig;

        if (this.serverConfig.vipModels.has(modelConfig.model)) {
          if (
            !useUserStore.getState().is_vip ||
            !this.serverConfig.vipCodes.has(this.code())
          ) {
            responseText = Locale.Auth.Vip;
            return finish();
          }
        }

        if (
          !useUserStore.getState().is_vip &&
          useUserStore.getState().wallet < 1 &&
          !this.serverConfig.vipCodes.has(this.code()) &&
          useAccessStore.getState().auth
        ) {
          responseText = Locale.Auth.Wallet;
          return finish();
        }

        controller.signal.onabort = finish;

        fetchEventSource(chatPath, {
          ...chatPayload,
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");
            console.log(
              "[OpenAI] request response content type: ",
              contentType,
            );

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }

            if (
              !res.ok ||
              !res.headers
                .get("content-type")
                ?.startsWith(EventStreamContentType) ||
              res.status !== 200
            ) {
              const responseTexts = [responseText];
              let extraInfo = await res.clone().text();
              try {
                const resJson = await res.clone().json();
                extraInfo = prettyObject(resJson);
              } catch {}

              if (res.status === 401) {
                responseTexts.push(Locale.Error.Unauthorized);
              }

              if (extraInfo) {
                responseTexts.push(extraInfo);
              }

              responseText = responseTexts.join("\n\n");

              return finish();
            }
          },
          onmessage(msg) {
            if (msg.data === "[DONE]" || finished) {
              if (
                (!useUserStore.getState().is_vip ||
                  !config.vipCodes.has(code)) &&
                useAccessStore.getState().auth
              ) {
                userapi.llm.updateWallet(1);
              }

              return finish();
            }
            const text = msg.data;
            try {
              const json = JSON.parse(text);
              const delta = json.choices[0].delta.content;
              if (delta) {
                responseText += delta;
                options.onUpdate?.(responseText, delta);
              }
            } catch (e) {
              console.error("[Request] parse error", text, msg);
            }
          },
          onclose() {
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        if (this.serverConfig.vipModels.has(modelConfig.model)) {
          if (
            !useUserStore.getState().is_vip ||
            !this.serverConfig.vipCodes.has(this.code())
          ) {
            options.onFinish(Locale.Auth.Vip);
            return;
          }
        }

        if (
          !useUserStore.getState().is_vip &&
          useUserStore.getState().wallet < 1 &&
          !this.serverConfig.vipCodes.has(this.code()) &&
          useAccessStore.getState().auth
        ) {
          options.onFinish(Locale.Auth.Wallet);
          return;
        }

        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);

        if (
          (!useUserStore.getState().is_vip ||
            !this.serverConfig.vipCodes.has(this.code())) &&
          useAccessStore.getState().auth
        ) {
          userapi.llm.updateWallet(1);
        }
        if (useAccessStore.getState().auth) {
          userapi.llm.addChatMessage(
            getBody("文字", message, modelConfig.model),
          );
        }
        options.onFinish(message);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat request", e);
      options.onError?.(e as Error);
    }
  }
  async usage() {
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDate = formatDate(startOfMonth);
    const endDate = formatDate(new Date(Date.now() + ONE_DAY));

    const [used, subs] = await Promise.all([
      fetch(
        this.path(
          `${OpenaiPath.UsagePath}?start_date=${startDate}&end_date=${endDate}`,
        ),
        {
          method: "GET",
          headers: getHeaders(),
        },
      ),
      fetch(this.path(OpenaiPath.SubsPath), {
        method: "GET",
        headers: getHeaders(),
      }),
    ]);

    if (used.status === 401) {
      throw new Error(Locale.Error.Unauthorized);
    }

    if (!used.ok || !subs.ok) {
      throw new Error("Failed to query usage from openai");
    }

    const response = (await used.json()) as {
      total_usage?: number;
      error?: {
        type: string;
        message: string;
      };
    };

    const total = (await subs.json()) as {
      hard_limit_usd?: number;
    };

    if (response.error && response.error.type) {
      throw Error(response.error.message);
    }

    if (response.total_usage) {
      response.total_usage = Math.round(response.total_usage) / 100;
    }

    if (total.hard_limit_usd) {
      total.hard_limit_usd = Math.round(total.hard_limit_usd * 100) / 100;
    }

    return {
      used: response.total_usage,
      total: total.hard_limit_usd,
    } as LLMUsage;
  }

  async models(): Promise<LLMModel[]> {
    // if (this.disableListModels) {
    //   return DEFAULT_MODELS.slice();
    // }

    // const res = await fetch(this.path(OpenaiPath.ListModelPath), {
    //   method: "GET",
    //   headers: {
    //     ...getHeaders(),
    //   },
    // });

    // const resJson = (await res.json()) as OpenAIListModelResponse;
    // const chatModels = resJson.data?.filter((m) => m.id.startsWith("gpt-"));
    // console.log("[Models]", chatModels);

    // if (!chatModels) {
    //   return [];
    // }

    // return chatModels.map((m) => ({
    //   name: m.id,
    //   available: true,
    // }));
    return [];
  }
}
export { OpenaiPath };
