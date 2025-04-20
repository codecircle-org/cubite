"use server";

import createAdminUser from "@/app/utils/createAdminUser";
import { z } from "zod";

const personalEmailDomains = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
  "gmx.com",
  "protonmail.com",
  "yandex.com",
  "live.com",
  "msn.com",
  "qq.com",
  "163.com",
  "126.com",
  "sina.com",
  "sohu.com",
  "foxmail.com",
  "inbox.com",
  "lycos.com",
  "rediffmail.com",
  "tutanota.com",
  "fastmail.com",
  "hushmail.com",
  "excite.com",
  "netscape.net",
  "aim.com",
  "rocketmail.com",
  "bigpond.com",
  "eircom.net",
  "comcast.net",
  "verizon.net",
  "charter.net",
  "shaw.ca",
  "rogers.com",
  "bell.net",
  "btinternet.com",
  "virginmedia.com",
  "sky.com",
  "talktalk.net",
  "ntlworld.com",
  "orange.fr",
  "wanadoo.fr",
  "freenet.de",
  "web.de",
  "seznam.cz",
  "centrum.cz",
  "mail.ru",
  "list.ru",
  "bk.ru",
  "inbox.ru",
  "mail.kz",
  "mail.bg",
  "abv.bg",
  "bol.com.br",
  "uol.com.br",
  "terra.com.br",
  "ig.com.br",
  "zipmail.com.br",
  "globo.com",
  "r7.com",
  "ig.com.br",
  "terra.com.mx",
  "prodigy.net.mx",
  "hotmail.es",
  "hotmail.fr",
  "hotmail.de",
  "live.fr",
  "live.de",
  "live.co.uk",
  "hotmail.co.uk",
  "live.com.au",
  "hotmail.com.au",
  "optusnet.com.au",
  "bigpond.net.au",
  "tpg.com.au",
  "iinet.net.au",
  "dodo.com.au",
  "internode.on.net",
];

const registerUser = async (prevState: any, formData: FormData) => {
  const userObject = {
    name: formData.get("name")!.toString(),
    username: formData.get("username")!.toString(),
    email: formData.get("email")!.toString(),
    password: formData.get("password")!.toString(),
    organization: formData.get("organization")!.toString(),
  };

  const schema = z.object({
    name: z
      .string()
      .min(6, { message: "Name should be at least 6 characters long." }),
    username: z
      .string()
      .min(3, { message: "Username should be at least 3 characters long." }),
    email: z
      .string()
      .email()
      .refine(
        (email) => {
          const domain = email.split("@")[1];
          return !personalEmailDomains.includes(domain);
        },
        {
          message: "Please use your work email address.",
        }
      ),
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long." })
      .max(32, { message: "Password should be at most 32 characters long." })
      .refine(
        (password) => {
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          return hasNumber && hasSpecialCharacter;
        },
        {
          message:
            "Password must contain at least one number and one special character.",
        }
      ),
    organization: z
      .string()
      .min(3, {
        message: "Organization should be at least 3 characters long.",
      }),
  });

  const validation = schema.safeParse(userObject);
  if (!validation.success) {
    return {
      status: 400,
      message: validation.error.issues.map((issue) => issue.message).join(", "),
    };
  }

  const newUser = await createAdminUser(userObject);
  return newUser;
};

export default registerUser;
