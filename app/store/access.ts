import { DEFAULT_API_HOST, DEFAULT_MODELS, StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import md5 from "spark-md5";
import { Base64 } from "js-base64";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const DEFAULT_OPENAI_URL =
  getClientConfig()?.buildMode === "export" ? DEFAULT_API_HOST : "/api/openai/";
console.log("[API] default openai url", DEFAULT_OPENAI_URL);

const DEFAULT_ACCESS_STATE = {
  token: "",
  auth: "",
  accessCode: "",
  needCode: true,
  hideUserApiKey: false,
  hideBalanceQuery: false,
  disableGPT4: false,
  vipCodes: "",
  vipModels: "",

  openaiUrl: DEFAULT_OPENAI_URL,
};

export const useAccessStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE },

  (set, get) => ({
    enabledAccessControl() {
      this.fetch();

      return get().needCode;
    },
    updateCode(code: string) {
      set(() => ({ accessCode: code?.trim() }));
    },
    updateToken(token: string) {
      set(() => ({ token: token?.trim() }));
    },
    updateAuth(auth: string) {
      set(() => ({ auth: auth?.trim() }));
    },
    updateOpenAiUrl(url: string) {
      set(() => ({ openaiUrl: url?.trim() }));
    },
    isAuthorized() {
      this.fetch();

      if (!!get().token) {
        return !!get().token;
      } else {
        return (
          (!!get().accessCode && this.enabledAccessControl()) ||
          (!!get().auth && !this.enabledAccessControl()) ||
          (this.enabledAccessControl() && !!get().auth)
        );
      }
      // has token or has code or disabled access control
    },
    fetch() {
      if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
      fetchState = 1;
      fetch("/api/config", {
        method: "post",
        body: null,
        headers: {
          ...getHeaders(),
        },
      })
        .then((res) => res.json())
        .then((res: DangerConfig) => {
          console.log("[Config] got config from server", res);
          res.vipCodes = Base64.decode(res.vipCodes) as string;
          res.vipModels = Base64.decode(res.vipModels) as string;
          console.log("[Config] got config from server", res);
          set(() => ({ ...res }));

          if (res.disableGPT4) {
            DEFAULT_MODELS.forEach(
              (m: any) => (m.available = !m.name.startsWith("gpt-4")),
            );
          }
        })
        .catch(() => {
          console.error("[Config] failed to fetch config");
        })
        .finally(() => {
          fetchState = 2;
        });
    },
    isVipCode(code: string) {
      let vipCodes = new Set();
      try {
        const codes = (get().vipCodes?.split(",") ?? [])
          .filter((v) => !!v)
          .map((v) => md5.hash(v.trim()));
        vipCodes = new Set(codes);
      } catch (e) {
        vipCodes = new Set();
      }
      return vipCodes.has(md5.hash(code));
    },
    isVipModel(model: string) {
      let vipModels = new Set();
      try {
        const models = (get().vipModels?.split(",") ?? [])
          .filter((v) => !!v)
          .map((v) => md5.hash(v.trim()));
        vipModels = new Set(models);
      } catch (e) {
        vipModels = new Set();
      }
      return vipModels.has(md5.hash(model));
    },
  }),
  {
    name: StoreKey.Access,
    version: 1,
  },
);
