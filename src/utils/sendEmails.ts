import ejs from 'ejs';
import path from 'path';
import type { SendRawEmailCommandOutput } from '@aws-sdk/client-ses';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import BadRequest from '../common/exceptions/badRequest';
import config from '../config/config';
import { sesClient } from '../config/ses/ses.config';

interface MailOptionsExtended {
    to: string | string[];
    subject: string;
    from?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    [key: string]: unknown;
}

interface SendEmailsParams {
    mailOptions: MailOptionsExtended;
    fileName: string;
    contentVariables: Record<string, unknown>;
    attachments?: {
        fileContent: string;
        filename: string;
        mimeType: string;
    }[];
}

const sendEmails = async ({
    mailOptions,
    fileName,
    contentVariables,
    attachments,
}: SendEmailsParams): Promise<SendRawEmailCommandOutput> => {
    const templatePath = path.join(
        __dirname,
        '..',
        'public',
        'templates',
        fileName
    );

    const senderEmail = config.SES_EMAIL;

    try {
        const html = await ejs.renderFile(templatePath, {
            ...contentVariables,
            baseurl: process.env.SERVER_URL,
        });
        const toAddresses = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
        const subject = mailOptions.subject || '';

        const params = {
            Source: senderEmail, // must be verified in SES
            Destination: {
                ToAddresses: toAddresses,
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8',
                },
                Body: {
                    Html: {
                        Data: html,
                        Charset: 'UTF-8',
                    }
                },
            },
        };

        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        console.log('Email sent successfully:', response.MessageId);
        return response;
    } catch (err: unknown) {
        console.log(`Error sending email: ${err instanceof Error ? err.message : String(err)}`);
        if (err instanceof Error) {
            throw new BadRequest(err.message);
        } else {
            throw new BadRequest(String(err));
        }
    }
};

export default sendEmails;
