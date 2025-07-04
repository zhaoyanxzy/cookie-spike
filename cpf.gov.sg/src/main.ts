import { frontendTemplate } from "../../frontend-template";
import { API_DOMAIN } from "./paths";

const main = frontendTemplate(API_DOMAIN, "CPF", false);
const simulateCpfRedirect = async () => {
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwibW9sLXZhbHVlIjoic29tZSB2YWx1ZXMgd2Ugd2FudCB0byBwYXNzIn0.qlVE7bqpjV_-Jv6XnhE_64hCb1qd4KL3a2kfTinV-AU";

  await fetch(`https://api.life.gov.sg:4000/token-accept?token=${jwtToken}`, {
    method: "GET",
    credentials: "include",
  });
};

main();
await simulateCpfRedirect();
