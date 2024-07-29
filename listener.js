import amqp from 'amqplib'

import dotenv from "dotenv"
import launchProcess from './app.js';
dotenv.config();

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()




const RABBITMQ_URL = process.env.RABBITMQ_URL;

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



async function listener() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'scraperQueue';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log(`Received new Process`);
        // console.log(JSON.parse(messageContent));

        const body = JSON.parse(messageContent).body;
        const proc = JSON.parse(messageContent).process;
        const uploadToken = JSON.parse(messageContent).uploadToken;

        console.log("Start Scraping")



        await prisma.process.update({
          where: {
            id: proc.id
          },
          data: {
            status: "INPROGRESS"
          }
        })
        // start scraping
        await launchProcess({
          profileUser: profileUsers[0],
          uploadToken,
          proc, 
          profile,
          proxy,
          url: body.url,
          slug: body.slug //process.env.SLUG
        })

        console.log("done Scrapping", proc.id);


        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error:', error);
  }
}

listener();
