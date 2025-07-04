import express from "express";
import fs from "fs";
import tls from "tls";
import https from "https";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  HOSTNAME,
  PORT,
  CERT_KEY_PATH,
  CERT_PATH,
  CPF_CERT_KEY_PATH,
  CPF_CERT_PATH,
  COOKIE_DOMAIN,
  JWT_SECRET,
} from "./paths.js";

const app = express();

const defaultCert = {
  key: fs.readFileSync(CERT_KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
};
// const additionalCerts = {
//   "cpf.gov.sg": tls.createSecureContext({
//     key: fs.readFileSync(CPF_CERT_KEY_PATH),
//     cert: fs.readFileSync(CPF_CERT_PATH),
//   }),
// };
const options = {
  ...defaultCert,
  // SNICallback: (servername, cb) => {
  //   const ctx = additionalCerts[servername];
  //   if (ctx) {
  //     cb(null, ctx);
  //   } else {
  //     cb(null, tls.createSecureContext(defaultCert)); // fallback
  //   }
  // },
};

app.use(
  cors({
    origin: [
      "https://life.gov.sg:3000",
      "https://mylegacy.life.gov.sg:3001",
      // "https://cpf.gov.sg:3002",
    ],
    credentials: true, // required to support `credentials: 'include'`
  })
);
app.get("/clear-cookies", (req, res) => {
  // will cause the cookies to be set without values
  // res.clearCookie("mol", {
  //   domain: ".life.gov.sg",
  //   secure: true,
  //   httpOnly: false,
  //   sameSite: "None",
  //   path: "/",
  // });
  // res.clearCookie("mol_http_only", {
  //   domain: ".life.gov.sg",
  //   secure: true,
  //   httpOnly: true,
  //   sameSite: "None",
  //   path: "/",
  // });
  res.json({ cleared: true });
});

app.get("/set-cookie", (req, res) => {
  res.cookie("mol", "mol-cookie", {
    domain: COOKIE_DOMAIN,
    secure: true, // required for https
    httpOnly: false,
    sameSite: "Strict", // None, Lax, Strict
  });
  res.send({ message: "set-cookie set" });
});

app.get("/set-http-only-cookie", (req, res) => {
  res.cookie("mol_http_only", "mol-http-only-cookie", {
    domain: COOKIE_DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: "Strict", // None, Lax, Strict
  });
  res.send({ message: "set-http-only-cookie set" });
});

app.get("/read-cookie", (req, res) => {
  res.send({ cookie: req.headers.cookie });
});

// Token accept via redirect
app.get("/token-accept", (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send("Missing token");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("🚀 >>> ~ app.get ~ payload:", payload);

    res.cookie("mol", payload["mol-value"], {
      domain: ".life.gov.sg",
      secure: true,
      httpOnly: false,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // If needed we can do a redirect
    // res.redirect("https://life.gov.sg:3000");

    res.json({ message: "ok" });
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Listening on https://${HOSTNAME}:${PORT}`);
});
