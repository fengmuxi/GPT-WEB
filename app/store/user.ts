import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { showToast } from "../components/ui-lib";
import { useAccessStore } from "./access";
import {
  loginBody,
  registerBody,
  updatePassBody,
  userapi,
} from "../client/userapi";
import { createPersistStore } from "../utils/store";

function getLogin() {
  setTimeout(() => {
    window.location.href = "/#/login";
  }, 1000);
}

export interface UserStore {
  user: string;
  password: string;
  name: string;
  wallet: number;
  vip_time: string;
  is_vip: boolean;
  mail: string;
  sig_state: string;
  head: string;
  uuid: string;
  img: string;
  update: (updater: (user: UserInfo) => void) => void;
  login: (userName: string, password: string, code: string) => void;
  register: (
    user: string,
    password: string,
    name: string,
    mail: string,
    code: string,
  ) => void;
  getMailCode: (mail: string) => void;
  userSig: () => void;
  setUuidAndImg: (uuid: string, img: string) => void;
  getCode: () => any;
  reset: () => void;
  updateUser: (user: string) => void;
  updatePassword: (password: string) => void;
  updateInfo: (
    name: string,
    wallet: number,
    vip_time: string,
    mail: string,
    sig_state: string,
    head: string,
  ) => void;
  updateWallet: (wallet: number) => void;
  updateName: (name: string) => void;
  getUserInfo: () => void;
  findPwd: (mail: string, code: string) => void;
  useKami: (code: string) => void;
  logOut: () => any;
  getRestPwdCode: (mail: string) => void;
  updatePass: (oldPass: string, newPass: string) => void;
  isVip: (time: string) => void;
}
export const DEFAULT_USER = {
  user: "",
  password: "",
  name: "",
  wallet: 0,
  vip_time: "2000-01-01",
  mail: "",
  sig_state: "",
  head: "",
  uuid: "",
  img: "",
  is_vip: false,
};
export type UserInfo = typeof DEFAULT_USER;
export const useUserStore = createPersistStore(
  { ...DEFAULT_USER },
  (set, get) => ({
    updateInfo(
      name: string,
      wallet: number,
      vip_time: string,
      mail: string,
      sig_state: string,
      head: string,
      is_vip: boolean,
    ) {
      set(() => ({
        name: name,
        wallet: wallet,
        vip_time: vip_time,
        mail: mail,
        sig_state: sig_state,
        head: head,
        is_vip: is_vip,
      }));
    },
    reset() {
      set(() => ({ ...DEFAULT_USER }));
    },
    updateUser(user: string) {
      set(() => ({ user: user }));
    },
    setUuidAndImg(uuid: string, img: string) {
      set(() => ({ uuid: uuid, img: img }));
    },
    async getCode() {
      let response = await userapi.llm.getCode();
      console.log(response);
      this.setUuidAndImg(response.uuid, response.img);
      return response.img;
    },
    async updateName(name: string) {
      let response = await userapi.llm.updateName(name);
      console.log(response);
      showToast(response.msg);
      if (response.flag) {
        await this.getUserInfo();
      } else {
        if (response.msg == "未登录！") {
          getLogin();
        }
      }
    },
    updatePassword(password: string) {
      set(() => ({ password: password }));
    },
    updateWallet(wallet: number) {
      set(() => ({ wallet: get().wallet - wallet }));
    },
    async login(user: string, password: string, code: string) {
      let body = {
        username: user,
        password: password,
        code: code,
        uuid: get().uuid,
      } as loginBody;
      let response = await userapi.llm.login(body);
      console.log(response);
      if (response.flag) {
        this.updateUser(user);
        useAccessStore.getState().updateAuth(response.data.token);
        showToast("登录成功！");
        setTimeout(() => {
          window.location.href = "/#/chat";
        }, 1000);
        await this.getUserInfo();
      } else {
        showToast(response.message);
      }
    },
    async register(
      user: string,
      password: string,
      name: string,
      mail: string,
      code: string,
    ) {
      let body = {
        user: user,
        name: name,
        password: password,
        code: code,
        mail: mail,
      } as registerBody;
      let response = await userapi.llm.register(body);
      console.log(response);
      if (response.flag) {
        showToast("注册成功");
        setTimeout(() => {
          window.location.href = "/#/login";
        }, 1000);
      } else {
        showToast(response.msg);
      }
    },
    async getMailCode(mail: string) {
      let response = await userapi.llm.getMailCode(mail);
      console.log(response);
      showToast(response.msg);
    },
    async userSig() {
      let response = await userapi.llm.userSig();
      console.log(response);
      showToast(response.msg);
      if (response.flag) {
        await this.getUserInfo();
      } else {
        if (response.msg == "未登录！") {
          getLogin();
        }
      }
    },
    async getUserInfo() {
      let responsedata = await userapi.llm.getUserInfo();
      if (responsedata.flag) {
        let data = responsedata.data;
        this.updateInfo(
          data.nickName,
          data.wallet,
          data.vipTime,
          data.email,
          data.sigState,
          data.head,
          await this.isVip(),
        );
      } else {
        showToast(responsedata.msg);
        if (responsedata.msg == "未登录！") {
          getLogin();
        }
      }
    },
    async findPwd(mail: string, code: string) {
      let response = await userapi.llm.findPwd(mail, code);
      console.log(response);
      if (response.flag) {
        showToast("密码已发送至您的邮箱，请注意查收！");
      } else {
        showToast(response.message);
      }
    },
    async useKami(code: string) {
      let response = await userapi.llm.useKami(
        get().user,
        get().password,
        code,
      );
      console.log(response);
      if (response.flag) {
        showToast(response.msg);
        await this.getUserInfo();
      } else {
        showToast(response.msg);
        if (response.msg == "未登录！") {
          getLogin();
        }
      }
    },
    async logOut() {
      let response = await userapi.llm.logOut();
      console.log(response);
      if (response.flag) {
        this.reset();
        showToast(response.msg);
      } else {
        showToast(response.msg);
      }
    },
    async getRestPwdCode(mail: string) {
      let response = await userapi.llm.getRestPwdCode(mail);
      console.log(response);
      if (response.flag) {
        showToast("发送成功！可能在垃圾邮箱中！");
      } else {
        showToast(response.msg);
      }
    },
    async updatePass(oldPass: string, newPass: string) {
      let body = {
        oldPass: oldPass,
        newPass: newPass,
      } as updatePassBody;
      let ress = await userapi.llm.updatePass(body);
      if (ress.message == null) {
        showToast("修改成功！");
      } else {
        showToast(ress.message);
      }
    },
    async isVip() {
      let response = await userapi.llm.isVip();
      console.log(response);
      if (response.flag) {
        return true;
      } else {
        return false;
      }
    },
  }),
  {
    name: StoreKey.User,
    version: 1,
  },
);
