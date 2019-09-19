export default function wrapperHtml(
  html: string,
  deviceWidth: number = 540
): string {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,max-scale=1"/>
      <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
      <title>Document</title>
      <style>
        *{
          margin:0;
          padding:0;
          line-height:1.2em
        }
        div,p{
          line-height:1.2em
        }
        html,body{
          height:100%;
          width:100%;
        }
        img{
          width:100%;
          border-radius:7px
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
`;
}
