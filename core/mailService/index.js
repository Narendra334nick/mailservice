import { configuration } from "../config/config.js";
import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";

class mailService {
	//* info : transporter is going to be an object that is able to send mail
	#transporter;
	/**
	 * Contructor function takes optional configuration else it will will use the default configuration
	 * @constructor
	 * @param {dynamicConfig} - dynamic config from top while creating class which need to use some specific mail service configuraton
	 */

	constructor() {
		this.initializeTransporter();
	}
	/**
	 * @param {*} moduleName - ex - Attendance,Analytics gives you module wise configurations for service
	 */
	async initializeTransporter() {
		try {
			const config = {
				pool: true,
				service: "gmail",
				connectionTimeout: 300000,
				auth: {
					type: "OAuth2",
					user: configuration.user,
					clientId: configuration?.clientId,
					clientSecret: configuration?.clientSecret,
					refreshToken: configuration?.refreshToken,
				},
				tls: {
					rejectUnauthorized: true,
				},
			};
			this.#transporter = nodemailer.createTransport(config);
			console.log("transporter initialized successfully !!!");
		} catch (error) {
			throw error;
		}
	}

	/**
	 * #send is a private function it will send the mail using options
	 * @param {*} options - options defines the mail content
	 * @returns - info includes the result, the exact format depends on the transport mechanism used
	 */
	async #send(mailOptions) {
		try {
			const transporter = this.#transporter;
			const info = await transporter.sendMail(mailOptions);
			console.log("Email Sent -->>",info);
      return info;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * #sendMail is a public function it will send the mail using options
	 * @param {*} options - options defines the mail content
	 * @returns - info includes the result, the exact format depends on the transport mechanism used
	 */
	async sendMail(mailOptions) {
		try {
			mailOptions[`from`] = configuration?.user;
			// Get the parent directory of the current directory in an ES6 module
			const currentModuleDirectory = dirname(fileURLToPath(import.meta.url));
			const parentDirectory = resolve(currentModuleDirectory, "..");
			// Read the HTML file content
			const htmlFilePath = path.join(
				parentDirectory,
				"/mailService/mailTemplate/demo.html"
			);
			let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
      if (mailOptions?.bodyVariables) {
        Object.keys(mailOptions?.bodyVariables).map((item) => {
          htmlContent = htmlContent?.replace(
            new RegExp(item, 'gi'),
            mailOptions?.bodyVariables?.[item],
          );
        });
      }
      mailOptions[`html`] = htmlContent;
      const info = await this.#send(mailOptions);
      return info;
		} catch (error) {
			console.log("error --->>", error);
		}
	}
}

export default mailService;
