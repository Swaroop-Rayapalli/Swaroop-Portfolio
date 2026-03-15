# Environment Variables Setup

This project uses environment variables to manage sensitive information like email credentials.

## Required Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `EMAIL_SENDER` | The Gmail address used to send notifications. | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | A 16-character [Gmail App Password](https://myaccount.google.com/apppasswords). | `abcd efgh ijkl mnop` |

## Local Development

1.  **Create a `.env` file**: 
    Copy the `.env.example` file and rename it to `.env`.
    ```bash
    cp .env.example .env
    ```
2.  **Fill in your credentials**:
    Open `.env` and enter your actual Gmail address and App Password.
3.  **Security**:
    The `.env` file is already listed in `.gitignore` and will **not** be uploaded to GitHub.

## Production (Vercel)

When deploying to Vercel, you must manually add these variables in the Vercel Dashboard:

1.  Go to your project **Settings** > **Environment Variables**.
2.  Add `EMAIL_SENDER` and `EMAIL_PASSWORD` with their respective values.
3.  Redeploy your project for the changes to take effect.

> [!IMPORTANT]
> Never share your `.env` file or commit it to a public repository.
