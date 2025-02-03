# Task Manager App

Uma aplicação moderna de gerenciamento de tarefas construída com Vue.js 3 e Quasar Framework.

## Características

- 📱 Interface responsiva otimizada para dispositivos móveis
- 🌙 Suporte a modo escuro
- 🔐 Autenticação com JWT
- 📝 CRUD completo de tarefas
- 🎨 UI moderna e intuitiva
- ♿ Recursos de acessibilidade
- 🚀 Animações suaves
- 🔄 Gerenciamento de estado com Pinia
- 🐳 Containerização com Docker

## Pré-requisitos

- Node.js >= 16
- NPM >= 8
- Docker (opcional)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/task-manager-app.git
cd task-manager-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

## Build

Para criar uma build de produção:

```bash
npm run build
```

## Docker

Para construir e executar com Docker:

```bash
# Construir a imagem
docker build -t task-manager-app .

# Executar o container
docker run -p 80:80 task-manager-app
```

## Testes

Para executar os testes unitários:

```bash
npm run test:unit
```

## Estrutura do Projeto

```
src/
├── assets/        # Recursos estáticos
├── boot/          # Arquivos de inicialização
├── components/    # Componentes Vue reutilizáveis
├── css/          # Estilos globais
├── layouts/      # Layouts da aplicação
├── pages/        # Componentes de página
├── router/       # Configuração de rotas
└── stores/       # Stores Pinia
```

## Tecnologias Principais

- Vue.js 3
- Quasar Framework
- Pinia
- Vue Router
- Axios
- Vite
- Vitest
- SCSS
- JWT

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
