import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

const no: PartialLocaleType = {
  WIP: "Arbeid pågår ...",
  Error: {
    Unauthorized:
      "Du har ikke tilgang. [Vennlig oppgi tildelt adgangskode](/#/auth).",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} meldinger`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} meldinger med ChatGPT`,
    Actions: {
      ChatList: "Gå til chatlisten",
      CompressedHistory: "Komprimert historikk for instrukser",
      Export: "Eksporter alle meldinger i markdown-format",
      Copy: "Kopier",
      Stop: "Stopp",
      Retry: "Prøv igjen",
      Delete: "Slett",
    },
    Rename: "Gi nytt navn",
    Typing: "Skriver …",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} for å sende`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter for å omgi";
      }
      return inputHints + ", / for å søke instrukser";
    },
    Send: "Send",
  },
  Export: {
    Title: "Alle meldinger",
    Copy: "Kopiere alle",
    Download: "Last ned",
    MessageFromYou: "Melding fra deg",
    MessageFromChatGPT: "Melding fra ChatGPT",
  },
  Memory: {
    Title: "Minneinstruks",
    EmptyContent: "Ingen sålant.",
    Send: "Send minne",
    Copy: "Kopiere minne",
    Reset: "Nulstill sesjon",
    ResetConfirm:
      "Om du nillstiller vil du slette hele historikken. Er du sikker på at du vil nullstille?",
  },
  Home: {
    NewChat: "Ny chat",
    DeleteChat: "Bekreft for å slette det valgte dialogen",
    DeleteToast: "Samtale slettet",
    Revert: "Tilbakestill",
  },
  User: {
    Title: "用户",
    SubTitle: "用户信息界面",
    Login: "登录",
    LoginTitle: "用户登录",
    Register: "注册",
    RegisterTitle: "注册新用户",
    Findpwd: "找回密码",
    FindpwdTitle: "输入账号密码将发送至您的邮箱",
    Name: "用户名",
    Wallet: "用户积分",
    Mail: "用户邮箱",
    SigState: "签到状态",
    Ststus: "登出",
    Vip: "会员",
    kami: "兑换码",
    NickName: "昵称",
    User: "账号(纯数字)",
    Password: "密码(最少六位)",
    Email: "邮箱",
    Code: "验证码",
    Pass: {
      Title: "修改密码",
      OldPwd: "旧密码",
      NewPwd: "新密码",
      NewPwd1: "确认密码",
    },
    Save: "保存",
  },
  Settings: {
    Title: "Innstillinger",
    SubTitle: "Alle innstillinger",

    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Fontstørrelsen",
      SubTitle: "Juster fontstørrelsen for samtaleinnholdet.",
    },
    InjectSystemPrompts: {
      Title: "Sett inn systemprompter",
      SubTitle:
        "Tving tillegg av en simulert ChatGPT-systemprompt i begynnelsen av meldingslisten for hver forespørsel",
    },
    Update: {
      Version: (x: string) => `Versjon: ${x}`,
      IsLatest: "Siste versjon",
      CheckUpdate: "Se etter oppdatering",
      IsChecking: "Ser etter oppdatering ...",
      FoundUpdate: (x: string) => `Fant ny versjon: ${x}`,
      GoToUpdate: "Oppdater",
    },
    SendKey: "Send nøkkel",
    Theme: "Tema",
    TightBorder: "Stram innramming",
    Prompt: {
      Disable: {
        Title: "Skru av autofullfør",
        SubTitle: "Skriv / for å trigge autofullfør",
      },
      List: "Instruksliste",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} innebygde, ${custom} brukerdefinerte`,
      Edit: "Endre",
      Modal: {
        Title: "Instruksliste",
        Add: "Legg til",
        Search: "Søk instrukser",
      },
    },
    HistoryCount: {
      Title: "Tall på tilhørende meldinger",
      SubTitle: "Antall sendte meldinger tilknyttet hver spørring",
    },
    CompressThreshold: {
      Title: "Terskeverdi for komprimering av historikk",
      SubTitle:
        "Komprimer dersom ikke-komprimert lengde på meldinger overskrider denne verdien",
    },
    Token: {
      Title: "API Key",
      SubTitle:
        "Bruk din egen API-nøkkel for å ignorere tilgangskoden begrensning",
      Placeholder: "OpenAI API-nøkkel",
    },
    Usage: {
      Title: "Saldo for konto",
      SubTitle(used: any, total: any) {
        return `Brukt denne måneden $${used}, abonnement $${total}`;
      },
      IsChecking: "Sjekker ...",
      Check: "Sjekk",
      NoAccess: "Skriv inn API-nøkkelen for å sjekke saldo",
    },
    AccessCode: {
      Title: "Tilgangskode",
      SubTitle: "Tilgangskontroll på",
      Placeholder: "Trenger tilgangskode",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperatur",
      SubTitle: "Høyere verdi gir mer kreative svar",
    },
    MaxTokens: {
      Title: "Maks tokens",
      SubTitle: "Maksimum lengde på tokens for instrukser og svar",
    },
  },
  Store: {
    DefaultTopic: "Ny samtale",
    BotHello: "Hei! Hva kan jeg hjelpe deg med i dag?",
    Error: "Noe gikk galt, vennligst prøv igjen senere.",
    Prompt: {
      History: (content: string) =>
        "Dette er et sammendrag av chatthistorikken mellom AI-en og brukeren som en oppsummering: " +
        content,
      Topic:
        "Vennligst lag en fire til fem ords tittel som oppsummerer samtalen vår uten innledning, punktsetting, anførselstegn, punktum, symboler eller tillegg tekst. Fjern innrammende anførselstegn.",
      Summarize:
        "Oppsummer diskusjonen vår kort i 200 ord eller mindre for å bruke som en oppfordring til fremtidig sammenheng.",
    },
  },
  Copy: {
    Success: "Kopiert til utklippstavle",
    Failed: "Kopiering feilet. Vennligst gi tilgang til utklippstavlen.",
  },
  Context: {
    Toast: (x: any) => `Med ${x} kontekstuelle instrukser`,
    Edit: "Kontekstuelle -og minneinstrukser",
    Add: "Legg til",
  },
  Exporter: {
    Model: "Model",
    Messages: "Meldingar",
    Topic: "Emne",
    Time: "Tid",
  },
};

export default no;
