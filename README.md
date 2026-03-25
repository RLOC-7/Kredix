# Kredix - Sistema Bancário Digital

## 📋 Descrição

Kredix é uma aplicação full-stack de sistema bancário digital desenvolvida para demonstrar habilidades em desenvolvimento de software moderno. O projeto implementa funcionalidades essenciais de um banco digital, incluindo autenticação de usuários, gestão de contas bancárias, transações (depósitos, saques e transferências), notificações em tempo real e uma interface responsiva.

O sistema é composto por um backend robusto em Java Spring Boot e um frontend moderno em React com Vite, oferecendo uma experiência completa de aplicação web.

## 🚀 Funcionalidades

### Autenticação e Segurança
- **Login seguro** com JWT (JSON Web Tokens)
- **Registro de usuários** com validação de dados
- **Proteção de rotas** no frontend
- **Filtros de autenticação** no backend

### Gestão de Contas
- **Criação e atualização de perfis de usuário**
- **Visualização de dados bancários** (saldo, extrato)
- **Status de cadastro** ativo/inativo

### Transações Financeiras
- **Depósitos** em conta corrente
- **Saques** com validação de saldo
- **Transferências** entre contas
- **Histórico de transações** completo

### Notificações
- **Sistema de notificações em tempo real** via Server-Sent Events (SSE)
- **Alertas de transações** e atividades da conta

### Interface do Usuário
- **Dashboard interativo** com visão geral da conta
- **Páginas dedicadas** para investimentos, transferências e perfil
- **Design responsivo** com Tailwind CSS
- **Animações suaves** com Framer Motion
- **Navegação intuitiva** com React Router

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17** - Linguagem de programação principal
- **Spring Boot 4.0.4** - Framework para desenvolvimento rápido
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **JWT (JJWT)** - Tokens de autenticação
- **MySQL** - Banco de dados relacional
- **SpringDoc OpenAPI** - Documentação da API
- **Lombok** - Redução de código boilerplate
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento de páginas
- **Tailwind CSS** - Framework de estilos utilitários
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos
- **ESLint** - Linting e formatação de código

## 📁 Estrutura do Projeto

```
Kredix/
├── backend/                          # Aplicação Spring Boot
│   ├── src/main/java/com/Kredix/Kredix/
│   │   ├── config/                   # Configurações de segurança e JWT
│   │   ├── controller/               # Controllers REST
│   │   │   ├── UserController.java
│   │   │   ├── TransactionController.java
│   │   │   └── NotificationController.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── request/              # DTOs de entrada
│   │   │   └── response/             # DTOs de saída
│   │   ├── model/                    # Entidades JPA
│   │   │   ├── User.java
│   │   │   ├── Bank.java
│   │   │   └── Transaction.java
│   │   ├── repository/               # Repositórios de dados
│   │   ├── service/                  # Lógica de negócio
│   │   └── KredixApplication.java    # Classe principal
│   ├── src/main/resources/
│   │   └── application.properties    # Configurações da aplicação
│   └── pom.xml                       # Dependências Maven
├── frontend/                         # Aplicação React
│   ├── public/                       # Assets estáticos
│   ├── src/
│   │   ├── components/               # Componentes reutilizáveis
│   │   ├── contexts/                 # Contextos React (Auth, Toast)
│   │   ├── pages/                    # Páginas da aplicação
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Transfers.jsx
│   │   │   └── Investments.jsx
│   │   ├── services/                 # Serviços de API
│   │   └── App.jsx                   # Componente raiz
│   ├── package.json                  # Dependências Node.js
│   ├── vite.config.js                # Configuração Vite
│   └── index.html                    # Template HTML
└── README.md                         # Este arquivo
```

## 🔧 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Java 17** ou superior
- **Maven 3.6+** (ou use o wrapper `./mvnw`)
- **Node.js 18+** e **npm** ou **yarn**
- **MySQL 8.0+** rodando localmente

## 🚀 Como Executar

### 1. Clonagem do Repositório
```bash
git clone <url-do-repositorio>
cd Kredix
```

### 2. Configuração do Banco de Dados
1. Crie um banco de dados MySQL chamado `Kredix`
2. Atualize as credenciais no arquivo `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```

### 3. Execução do Backend
```bash
cd backend
# Usando Maven wrapper (recomendado)
./mvnw spring-boot:run
# Ou usando Maven instalado
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 4. Execução do Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### 5. Acesso à Aplicação
- Abra o navegador e acesse `http://localhost:5173`
- Registre um novo usuário ou faça login
- Explore as funcionalidades do sistema bancário

## 📚 API Endpoints

### Autenticação
- `POST /api/user/login` - Login de usuário
- `POST /api/user` - Registro de usuário

### Usuários
- `GET /api/user` - Listar todos os usuários
- `GET /api/user/{id}` - Buscar usuário por ID
- `PUT /api/user/{id}` - Atualizar usuário
- `GET /api/user/extract` - Obter extrato bancário

### Transações
- `POST /api/transaction/deposit` - Realizar depósito
- `POST /api/transaction/withdraw` - Realizar saque
- `POST /api/transaction/transfer` - Realizar transferência

### Notificações
- `GET /api/notifications/subscribe` - Inscrever-se em notificações SSE

## 🧪 Testes

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm run lint
```

## 🔒 Segurança

- **JWT Authentication**: Tokens seguros para autenticação
- **Password Encoding**: Senhas criptografadas no banco
- **CORS Configuration**: Controle de origens permitidas
- **Input Validation**: Validação de dados de entrada
- **SQL Injection Prevention**: Uso de JPA/Hibernate

## 🎨 Design e UX

- **Interface Moderna**: Design clean e intuitivo
- **Responsividade**: Funciona em desktop, tablet e mobile
- **Acessibilidade**: Contraste adequado e navegação por teclado
- **Feedback Visual**: Toasts e animações para feedback do usuário
- **Loading States**: Estados de carregamento para melhor UX

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autor

**Seu Nome** - [Seu GitHub](https://github.com/seu-usuario) - [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

## 🙏 Agradecimentos

- Spring Boot pela excelente documentação
- React pela poderosa biblioteca de componentes
- Comunidade open source pelas ferramentas utilizadas

---

⭐ Se este projeto foi útil para você, dê uma estrela no GitHub!</content>
<parameter name="filePath">c:\Apps\Kredix\README.md