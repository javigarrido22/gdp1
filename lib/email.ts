import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCodigoRecuperacion(email: string, codigo: string, nombre: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'OrdenateYA <onboarding@resend.dev>', // Cambiar cuando tengas dominio propio
      to: email,
      subject: 'Código de Recuperación de Contraseña - OrdenateYA',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .code {
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                text-align: center;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 8px;
                letter-spacing: 5px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <h2>Hola ${nombre},</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña de OrdenateYA.</p>
                <p>Tu código de verificación es:</p>
                <div class="code">${codigo}</div>
                <div class="warning">
                  <strong>⚠️ Importante:</strong>
                  <ul>
                    <li>Este código expira en <strong>10 minutos</strong></li>
                    <li>No compartas este código con nadie</li>
                    <li>Si no solicitaste este cambio, ignora este correo</li>
                  </ul>
                </div>
                <p>Ingresa este código en la página de recuperación para continuar.</p>
              </div>
              <div class="footer">
                <p>© 2026 OrdenateYA - Gestión Financiera Personal</p>
                <p>Este es un correo automático, por favor no responder.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
}