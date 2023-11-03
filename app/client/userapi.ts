import { getClientConfig } from "../config/client";
import { ACCESS_CODE_PREFIX } from "../constant";
import { ChatMessage, ModelType, useAccessStore } from "../store";
import { RequestMessage } from "./api";
import { UserApi } from "./user/user";

export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export const Models = ["gpt-3.5-turbo", "gpt-4"] as const;
export type ChatModel = ModelType;

export interface eladminRes {
  data: {
    user: object;
    token: string;
    nickName: string;
    wallet: number;
    vipTime: string;
    email: string;
    sigState: string;
    head: string;
  };
  flag: boolean;
  msg: string;
  message: string;
}

export interface codeRes {
  uuid: string;
  img: string;
}

export interface loginBody {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

export interface registerBody {
  user: string;
  name: string;
  password: string;
  code: string;
  mail: string;
}

export interface updatePassBody {
  oldPass: string;
  newPass: string;
}

export interface messageBody {
  messageType: string;
  messageText: string;
  messageSource: string;
}

export abstract class USERApi {
  abstract getCode(): Promise<codeRes>;
  abstract updateName(name: string): Promise<eladminRes>;
  abstract login(loginBody: loginBody): Promise<eladminRes>;
  abstract register(registerBody: registerBody): Promise<eladminRes>;
  abstract getMailCode(mail: string): Promise<eladminRes>;
  abstract userSig(): Promise<eladminRes>;
  abstract getUserInfo(): Promise<eladminRes>;
  abstract findPwd(mail: string, code: string): Promise<eladminRes>;
  abstract useKami(
    user: string,
    password: string,
    code: string,
  ): Promise<eladminRes>;
  abstract logOut(): Promise<eladminRes>;
  abstract getRestPwdCode(mail: string): Promise<eladminRes>;
  abstract addChatMessage(message: messageBody): Promise<eladminRes>;
  abstract updatePass(updatePassBody: updatePassBody): Promise<eladminRes>;
  abstract isVip(): Promise<eladminRes>;
  abstract updateWallet(wallet: number): Promise<eladminRes>;
}

export class ClientApi {
  public llm: USERApi;

  constructor() {
    this.llm = new UserApi();
  }
}

export const userapi = new ClientApi();

export function getHeaders() {
  const accessStore = useAccessStore.getState();
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };

  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  // use user's api key first
  if (validString(accessStore.token)) {
    headers.Authorization = makeBearer(accessStore.token);
  } else if (
    accessStore.enabledAccessControl() &&
    validString(accessStore.accessCode)
  ) {
    headers.Authorization = makeBearer(
      ACCESS_CODE_PREFIX + accessStore.accessCode,
    );
  }

  headers.Auth = useAccessStore.getState().auth.trim();

  return headers;
}
