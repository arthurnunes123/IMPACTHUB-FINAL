# ImpactHub

Aplicativo Expo/React Native com API Node.js e banco MySQL.

## Requisitos
- Node.js 24 LTS e npm.
- MySQL 8 ou superior.
- Navegador para web ou Expo Go compatível com SDK 57 para celular.

## Instalação
Na pasta deste arquivo:

```powershell
npm ci
npm --prefix backend ci
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

Execute `database/impacthub.sql` no MySQL apenas para a instalação inicial: o script recria as tabelas e apaga dados anteriores.

Configure a conexão MySQL e uma chave aleatória longa em `JWT_SECRET` no arquivo `backend/.env`. As tabelas complementares são criadas automaticamente pela API.

## Execução
Em um terminal, execute `npm run api`. Em outro, execute `npm run web`.

Para celular, use `npm start` e abra o QR Code no Expo Go. Computador e celular devem estar na mesma rede. No desenvolvimento, deixe `EXPO_PUBLIC_API_URL` vazio para usar o proxy da API pelo Expo.

A API usa a porta 3333. Verificação de conexão: `http://localhost:3333/api/health`.

## Configurações opcionais
Preencha `SMTP_*` em `backend/.env` para recuperação de senha por e-mail. Configure `EXPO_PUBLIC_SUPPORT_EMAIL` no `.env` para contato com suporte.

Em produção, informe a URL HTTPS da API, incluindo `/api`, em `EXPO_PUBLIC_API_URL`, e configure `APP_ORIGIN` com o endereço do frontend.

## Verificação
```powershell
npm run lint
npm --prefix backend run check
npx expo export --platform web
```

Dependências instaladas e configurações privadas são preparadas na instalação e não fazem parte do pacote.
