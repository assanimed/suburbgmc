
import dotenv from "dotenv"
import launchProcess from './app.js';
dotenv.config();





const PROXY_SERVER_IP = '198.46.161.167';
const PROXY_SERVER_PORT = '5217';
const PROXY_USERNAME = 'srhtieuy';
const PROXY_PASSWORD = '5lkc6oed32gf';

const proxy = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_SERVER_IP}:${PROXY_SERVER_PORT}`
const profile = "newpro"

const URL = "https://merchants.google.com/mc/bestsellers?a=5358499518&tab=product&tableState=ChYKDGNvdW50cnlfY29kZRABGgQyAlVTCngKD3JhbmtlZF9jYXRlZ29yeRADGmM6YXsiMSI6IjIwMCIsIjIiOiJSaW5ncyIsIjMiOnsiMSI6IjE4OCIsIjIiOiJKZXdlbHJ5IiwiMyI6eyIxIjoiMTY2IiwiMiI6IkFwcGFyZWwgJiBBY2Nlc3NvcmllcyJ9fX0SGgoWZ29vZ2xlX3BvcHVsYXJpdHlfcmFuaxABGDI%3D&+a=+5358499518&hl=en"



const profileUsers = [
  {
    email: "daveneews@gmail.com",
    password: "ANAHOWA+23"
  }
]



async function execute() {
  await launchProcess({
    profile,
    proxy,
    url: URL,
    slug: "latest-test-" + Math.ceil(Math.random() * 40) //body.slug //process.env.SLUG
  })
}

execute();
