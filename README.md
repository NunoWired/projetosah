# Evento de Canto Católico

Estrutura inicial de uma landing page responsiva, acessível e de página única para divulgação de evento musical católico e futura venda de ingressos via Pix.

## Como abrir localmente

1. Extraia o arquivo compactado.
2. Abra a pasta `evento-canto-catolico` no VS Code.
3. Instale a extensão **Live Server**, se desejar visualizar com atualização automática.
4. Abra o arquivo `index.html` usando o Live Server.

## Estrutura

```text
assets/
  images/  Imagens do evento, artista e banners
  icons/   Ícones próprios, se necessários
  videos/  Arquivos locais, caso sejam usados
css/
  style.css       Estilos globais e tema claro/escuro
  responsive.css  Ajustes para tablet e celular
js/
  theme.js   Controle de tema e preferência salva no navegador
  script.js  Menu mobile, formulários de demonstração e ano do rodapé
index.html   Página principal
```

## Próximas etapas

- Substituir os textos provisórios pelos dados oficiais do evento.
- Inserir imagem de capa em `assets/images/hero-evento.jpg`.
- Inserir links e incorporações reais do YouTube e Instagram.
- Configurar o Firebase para pedidos, newsletter e painel administrativo.
- Integrar um gateway Pix no backend com Cloud Functions e webhook.
- Configurar envio de e-mails transacionais após confirmação do pagamento.

## Segurança

Não inclua no JavaScript do navegador chaves privadas do Firebase, gateway Pix ou serviço de e-mail. Essas integrações devem ser feitas em um backend seguro, por exemplo, Firebase Cloud Functions.
