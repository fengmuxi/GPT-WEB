import { DEFAULT_API_HOST, DEFAULT_MODELS, StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";

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
  }),
  {
    name: StoreKey.Access,
    version: 1,
  },
);
