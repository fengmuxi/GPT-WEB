import { AdminPath } from "@/app/constant";
import {
  USERApi,
  codeRes,
  eladminRes,
  getHeaders,
  loginBody,
  messageBody,
  registerBody,
  updatePassBody,
} from "../userapi";
import { useUserStore } from "@/app/store";

export class UserApi implements USERApi {
  async addChatMessage(message: messageBody): Promise<eladminRes> {
    let res = await fetch("/api/user/chatmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
      body: JSON.stringify(message),
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async isVip(): Promise<eladminRes> {
    let res = await fetch("/api/user/vip", {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async updateWallet(wallet: number): Promise<eladminRes> {
    let res = await fetch("/api/user/wallet?wallet=" + wallet, {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    if (response.flag == true) {
      useUserStore.getState().updateWallet(wallet);
    }
    return response;
  }

  async login(loginBody: loginBody): Promise<eladminRes> {
    let res = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginBody),
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async register(registerBody: registerBody): Promise<eladminRes> {
    let res = await fetch(
      "/api/user/register?user=" +
        registerBody.user +
        "&password=" +
        registerBody.password +
        "&name=" +
        registerBody.name +
        "&mail=" +
        registerBody.mail +
        "&code=" +
        registerBody.code,
      {
        method: "POST",
      },
    );
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async getMailCode(mail: string): Promise<eladminRes> {
    let res = await fetch("/api/user/mail?mail=" + mail, {
      method: "POST",
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async userSig(): Promise<eladminRes> {
    let res = await fetch("/api/user/sig", {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async getUserInfo(): Promise<eladminRes> {
    let res = await fetch("/api/user/info", {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async findPwd(mail: string, code: string): Promise<eladminRes> {
    let res = await fetch("/api/user/findpwd?mail=" + mail + "&code=" + code, {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async useKami(
    user: string,
    password: string,
    code: string,
  ): Promise<eladminRes> {
    let res = await fetch(
      "/api/user/kami?user=" + user + "&password=" + password + "&code=" + code,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
        },
      },
    );
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async logOut(): Promise<eladminRes> {
    let res = await fetch("/api/user/logout", {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async getRestPwdCode(mail: string): Promise<eladminRes> {
    let res = await fetch("/api/user/restmail?mail=" + mail, {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async updatePass(updatePassBody: updatePassBody): Promise<eladminRes> {
    let res = await fetch("/api/user/updatePass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
      body: JSON.stringify(updatePassBody),
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async updateName(name: string): Promise<eladminRes> {
    let res = await fetch("/api/user/set?name=" + name, {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as eladminRes;
    console.log(response);
    return response;
  }
  async getCode(): Promise<codeRes> {
    let res = await fetch("/api/user/code", {
      method: "POST",
      headers: {
        ...getHeaders(),
      },
    });
    let response = (await res.json()) as codeRes;
    console.log(response);
    return response;
  }
}
export { AdminPath };
