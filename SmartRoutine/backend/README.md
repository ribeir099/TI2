# Smart Routine API 🍽️📚

Sistema de gerenciamento de alimentos, receitas e rotinas alimentares desenvolvido em Java com PostgreSQL.

## Sumário 📋

- [Sobre o Projeto](#sobre-o-projeto-)
- [Funcionalidades](#funcionalidades-)
- [Tecnologias](#tecnologias-)
- [Arquitetura](#arquitetura-)
- [Diagrama ER](#diagrama-er-)
- [Pré-requisitos](#pré-requisitos-)
- [Instalação](#instalação-)
- [Configuração](#configuração-)
- [Executando o Projeto](#executando-o-projeto-)
- [Documentação da API](#documentação-da-api-)
- [Índice de Rotas](#índice-de-rotas)
- [1. Usuário](#1-usuário-)
  - [1.1 Listar Todos os Usuários](#11-listar-todos-os-usuários)
  - [1.2 Buscar Usuário por ID](#12-buscar-usuário-por-id)
  - [1.3 Criar Usuário](#13-criar-usuário)
  - [1.4 Atualizar Usuário](#14-atualizar-usuário)
  - [1.5 Deletar Usuário](#15-deletar-usuário)
  - [1.6 Login](#16-login)
- [2. Alimento](#2-alimento-)
  - [2.1 Listar Todos os Alimentos](#21-listar-todos-os-alimentos)
  - [2.2 Buscar Alimento por ID](#22-buscar-alimento-por-id)
  - [2.3 Listar Alimentos por Categoria](#23-listar-alimentos-por-categoria)
  - [2.4 Buscar Alimentos por Nome](#24-buscar-alimentos-por-nome)
  - [2.5 Listar Categorias Disponíveis](#25-listar-categorias-disponíveis)
  - [2.6 Criar Alimento](#26-criar-alimento)
  - [2.7 Atualizar Alimento](#27-atualizar-alimento)
  - [2.8 Deletar Alimento](#28-deletar-alimento)
- [3. Receita](#3-receita-)
  - [3.1 Listar Todas as Receitas](#31-listar-todas-as-receitas)
  - [3.2 Buscar Receita por ID](#32-buscar-receita-por-id)
  - [3.3 Buscar Receitas por Título](#33-buscar-receitas-por-título)
  - [3.4 Buscar Receitas por Tempo Máximo](#34-buscar-receitas-por-tempo-máximo)
  - [3.5 Buscar Receitas por Tag](#35-buscar-receitas-por-tag)
  - [3.6 Criar Receita](#36-criar-receita)
  - [3.7 Atualizar Receita](#37-atualizar-receita)
  - [3.8 Deletar Receita](#38-deletar-receita)
- [4. Registra (Compras)](#4-registra-compras-)
  - [4.1 Listar Todos os Registros](#41-listar-todos-os-registros)
  - [4.2 Buscar Registro por ID](#42-buscar-registro-por-id)
  - [4.3 Listar Registros por Usuário](#43-listar-registros-por-usuário)
  - [4.4 Produtos Próximos ao Vencimento](#44-produtos-próximos-ao-vencimento)
  - [4.5 Produtos Vencidos](#45-produtos-vencidos)
  - [4.6 Registrar Compra](#46-registrar-compra)
  - [4.7 Atualizar Registro](#47-atualizar-registro)
  - [4.8 Deletar Registro](#48-deletar-registro)
- [5. Receitas Favoritas](#5-receitas-favoritas-)
  - [5.1 Listar Todas as Receitas Favoritas](#51-listar-todas-as-receitas-favoritas)
  - [5.2 Buscar Favorita por ID](#52-buscar-favorita-por-id)
  - [5.3 Listar Favoritas de um Usuário](#53-listar-favoritas-de-um-usuário)
  - [5.4 Listar Usuários que Favoritaram uma Receita](#54-listar-usuários-que-favoritaram-uma-receita)
  - [5.5 Verificar se Receita é Favorita](#55-verificar-se-receita-é-favorita)
  - [5.6 Contar Favoritos de uma Receita](#56-contar-favoritos-de-uma-receita)
  - [5.7 Adicionar aos Favoritos](#57-adicionar-aos-favoritos)
  - [5.8 Remover dos Favoritos (por ID)](#58-remover-dos-favoritos-por-id)
  - [5.9 Remover dos Favoritos (por Usuário e Receita)](#59-remover-dos-favoritos-por-usuário-e-receita)
- [Estrutura do Projeto](#estrutura-do-projeto-)

---

## Sobre o Projeto 🎯

**Smart Routine** é uma API REST desenvolvida para gerenciar alimentos, receitas e rotinas alimentares de usuários. O sistema permite:

- 👤 Cadastro e autenticação de usuários
- 🥗 Catálogo de alimentos por categoria
- 📖 Receitas com informações nutricionais
- 🛒 Registro de compras de alimentos
- ⏰ Alertas de validade
- ⭐ Sistema de receitas favoritas

---

## Funcionalidades ✨

### Gestão de Usuários 👥
- ✅ Cadastro de usuários
- ✅ Autenticação (login)
- ✅ Atualização de perfil
- ✅ Exclusão de conta

### Gestão de Alimentos 🍎
- ✅ Cadastro de alimentos
- ✅ Categorização automática
- ✅ Busca por nome ou categoria
- ✅ Listagem de categorias disponíveis

### Gestão de Receitas 🍳
- ✅ Cadastro de receitas com informações JSON
- ✅ Busca por título, tempo de preparo ou tags
- ✅ Informações nutricionais e modo de preparo
- ✅ Sistema de favoritos

### Controle de Estoque 📦
- ✅ Registro de compras
- ✅ Controle de validade
- ✅ Alertas de produtos vencidos
- ✅ Alertas de produtos próximos ao vencimento
- ✅ Histórico de compras

### Sistema de Favoritos ⭐
- ✅ Adicionar receitas aos favoritos
- ✅ Listar receitas favoritas por usuário
- ✅ Contador de popularidade de receitas
- ✅ Remover favoritos

---

## Tecnologias 🛠️

### Backend
- **Java 11+** - Linguagem principal
- **Spark Framework 2.9.4** - Framework web
- **PostgreSQL 13+** - Banco de dados
- **JDBC** - Conexão com banco de dados
- **Gson** - Serialização JSON
- **Maven** - Gerenciador de dependências

### Segurança
- **PreparedStatement** - Proteção contra SQL Injection
- **Validação de entrada** - Sanitização de dados
- **CORS** - Controle de acesso

---

## Arquitetura 🏗️

O projeto segue o padrão **MVC (Model-View-Controller)** com camadas bem definidas:

```

            ┌─────────────┐
            │   Client    │  (Aplicações Frontend)
            └──────┬──────┘
                   │
                   ↓ HTTP/JSON
            ┌─────────────┐
            │   Service   │  (Regras de negócio, validações)
            └──────┬──────┘
                   │
                   ↓
            ┌─────────────┐
            │     DAO     │  (Acesso a dados, queries SQL)
            └──────┬──────┘
                   │
                   ↓
            ┌─────────────┐
            │    Model    │  (Entidades do domínio)
            └─────────────┘
                   │
                   ↓
            ┌─────────────┐
            │ PostgreSQL  │  (Banco de dados)
            └─────────────┘

```

### Camadas

1. **Model** - Entidades de domínio (POJO)
2. **DAO** - Data Access Object (acesso ao banco)
3. **Service** - Lógica de negócio e validações
4. **App** - Configuração de rotas e servidor

---

## Diagrama ER 📊

```

            ┌─────────────┐       ┌──────────────┐       ┌─────────────┐
            │   USUARIO   │       │   REGISTRA   │       │  ALIMENTO   │
            ├─────────────┤       ├──────────────┤       ├─────────────┤
            │ id (PK)     │───┐   │ id (PK)      │   ┌───│ id (PK)     │
            │ nome        │   │   │ usuario_id   │───┘   │ nome        │
            │ email       │   │   │ alimento_id  │───┐   │ categoria   │
            │ senha       │   │   │ data_compra  │   │   └─────────────┘
            │ data_nasc   │   │   │ data_validade│   │
            └─────────────┘   │   │ quantidade   │   │
                   │          │   │ lote         │   │
                   │          │   └──────────────┘   │
                   │          │                      │
                   │          └──────────────────────┘
                   │
                   │          ┌──────────────────┐
                   │          │   RECEITAS_      │
                   └──────────│   FAVORITAS      │
                              ├──────────────────┤
                              │ id (PK)          │
                              │ usuario_id (FK)  │
                   ┌──────────│ receita_id (FK)  │
                   │          │ data_adicao      │
                   │          └──────────────────┘
                   │
                   │          ┌─────────────┐
                   │          │   RECEITA   │
                   │          ├─────────────┤
                   │          │ id (PK)     │
                   └──────────│ titulo      │
                              │ porcao      │
                              │ tempo_prep  │
                              │ informacoes │ (JSONB)
                              └─────────────┘

```

---

## Pré-requisitos 📦

Antes de começar, certifique-se de ter instalado:

- ☑️ **Java JDK 11+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- ☑️ **PostgreSQL 13+** ([Download](https://www.postgresql.org/download/))
- ☑️ **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- ☑️ **Git** ([Download](https://git-scm.com/downloads))

### Verificar instalações

```bash
# Verificar Java
java -version
# Saída esperada: java version "11.0.x" ou superior
```

```bash
# Verificar Maven
mvn -version
# Saída esperada: Apache Maven 3.8.x
```

```bash
# Verificar PostgreSQL
psql --version
# Saída esperada: psql (PostgreSQL) 13.x
```

## Instalação 🚀
1. Clone o repositório
   git clone https://github.com/ribeir099/TI2/tree/main/SmartRoutine/backend.git
   cd backend

2. Crie o banco de dados
# Linux/Mac
sudo -u postgres psql -c "CREATE DATABASE smart_routine_db;"

# Windows (no psql)
psql -U postgres
CREATE DATABASE smart_routine_db;
\q

3. Configure as credenciais

## Configuração de Variáveis de Ambiente 🔐

O projeto utiliza variáveis de ambiente para configurações sensíveis.

### 1. Criar arquivo .env

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo .env com as suas configurações:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_routine_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
API_PORT=6789

4. Compile o projeto
   mvn clean compile

## Configuração ⚙️
Arquivo de Configuração

Arquivo: src/main/java/dao/DAO.java

private static final String URL = "jdbc:postgresql://localhost:5432/smart_routine_db";
private static final String USUARIO = "seu_usuario";
private static final String SENHA = "sua_senha";

## Executando o Projeto 🎮
Quick Start (Recomendado) ⚡
# 1. Inicializar banco de dados (criar tabelas + popular)
mvn exec:java -Dexec.mainClass="util.DatabaseInitializer"

# 2. Iniciar o servidor API
mvn exec:java -Dexec.mainClass="app.Aplicacao"

Verificar se está rodando 🔍
curl http://localhost:6789


Resposta esperada:

{
"message": "Smart Routine API - Running",
"version": "1.0",
"entities": ["usuario", "alimento", "receita", "registra", "favoritas"]
}


✅ Se você ver esta resposta, a API está funcionando!

## Documentação da API 📖

Base URL: http://localhost:6789

Headers Comuns:

Content-Type: application/json
Accept: application/json


Códigos de Status HTTP:

| Código | Descrição                                 |
|:------:|:------------------------------------------|
|  200   | OK - Requisição bem-sucedida              |
|  201   | Created - Recurso criado com sucesso      |
|  400   | Bad Request - Dados inválidos             |
|  401   | Unauthorized - Não autenticado            |
|  404   | Not Found - Recurso não encontrado        |
|  409   | Conflict - Conflito (ex: email duplicado) |
|  500   | Internal Server Error - Erro no servidor  |


## Índice de Rotas
👤 Usuário

|  Método  | Endpoint         | Descrição                |
|:--------:|:-----------------|:-------------------------|
|  `GET`   | `/usuario`       | Listar todos os usuários |
|  `GET`   | `/usuario/:id`   | Buscar usuário por ID    |
|  `POST`  | `/usuario`       | Criar novo usuário       |
|  `PUT`   | `/usuario/:id`   | Atualizar usuário        |
| `DELETE` | `/usuario/:id`   | Deletar usuário          |
|  `POST`  | `/usuario/login` | Autenticar usuário       |

🍎 Alimento

|  Método  | Endpoint                         | Descrição                 |
|:--------:|:---------------------------------|:--------------------------|
|  `GET`   | `/alimento`                      | Listar todos os alimentos |
|  `GET`   | `/alimento/:id`                  | Buscar alimento por ID    |
|  `GET`   | `/alimento/categoria/:categoria` | Listar por categoria      |
|  `GET`   | `/alimento/search?q=termo`       | Buscar por nome           |
|  `GET`   | `/alimento/categorias`           | Listar categorias         |
|  `POST`  | `/alimento`                      | Criar alimento            |
|  `PUT`   | `/alimento/:id`                  | Atualizar alimento        |
| `DELETE` | `/alimento/:id`                  | Deletar alimento          |

🍳 Receita

|  Método  | Endpoint                  | Descrição                |
|:--------:|:--------------------------|:-------------------------|
|  `GET`   | `/receita`                | Listar todas as receitas |
|  `GET`   | `/receita/:id`            | Buscar receita por ID    |
|  `GET`   | `/receita/search?q=termo` | Buscar por título        |
|  `GET`   | `/receita/tempo/:tempo`   | Buscar por tempo máximo  |
|  `GET`   | `/receita/tag/:tag`       | Buscar por tag           |
|  `POST`  | `/receita`                | Criar receita            |
|  `PUT`   | `/receita/:id`            | Atualizar receita        |
| `DELETE` | `/receita/:id`            | Deletar receita          |

📦 Registra (Compras)

|  Método  | Endpoint                                        | Descrição                 |
|:--------:|:------------------------------------------------|:--------------------------|
|  `GET`   | `/registra`                                     | Listar todos os registros |
|  `GET`   | `/registra/:id`                                 | Buscar registro por ID    |
|  `GET`   | `/registra/usuario/:usuarioId`                  | Listar por usuário        |
|  `GET`   | `/registra/usuario/:usuarioId/vencimento/:dias` | Próximos ao vencimento    |
|  `GET`   | `/registra/usuario/:usuarioId/vencidos`         | Produtos vencidos         |
|  `POST`  | `/registra`                                     | Registrar compra          |
|  `PUT`   | `/registra/:id`                                 | Atualizar registro        |
| `DELETE` | `/registra/:id`                                 | Deletar registro          |

⭐ Receitas Favoritas

|  Método  | Endpoint                                           | Descrição                 |
|:--------:|:---------------------------------------------------|:--------------------------|
|  `GET`   | `/favoritas`                                       | Listar todas as favoritas |
|  `GET`   | `/favoritas/:id`                                   | Buscar favorita por ID    |
|  `GET`   | `/favoritas/usuario/:usuarioId`                    | Favoritas de um usuário   |
|  `GET`   | `/favoritas/receita/:receitaId`                    | Usuários que favoritaram  |
|  `GET`   | `/favoritas/check/:usuarioId/:receitaId`           | Verificar se é favorita   |
|  `GET`   | `/favoritas/receita/:receitaId/count`              | Contar favoritos          |
|  `POST`  | `/favoritas`                                       | Adicionar aos favoritos   |
| `DELETE` | `/favoritas/:id`                                   | Remover por ID            |
| `DELETE` | `/favoritas/usuario/:usuarioId/receita/:receitaId` | Remover específica        |

## 1. Usuário 👤

### 1.1 Listar Todos os Usuários
**GET** `/usuario`  
Lista todos os usuários cadastrados no sistema.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/usuario
```

**Resposta (200 OK):**
```json
[
  { "id": 1, "nome": "Ana Carolina Silva", "email": "ana.silva@email.com", "dataNascimento": "1992-03-15" },
  { "id": 2, "nome": "Bruno Santos Costa", "email": "bruno.costa@email.com", "dataNascimento": "1988-07-22" },
  { "id": 3, "nome": "Carla Fernandes", "email": "carla.fernandes@email.com", "dataNascimento": "1995-11-08" }
]
```

---

### 1.2 Buscar Usuário por ID
**GET** `/usuario/:id`  
Busca um usuário específico pelo ID.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do usuário

**Exemplo de requisição:**
```bash
curl http://localhost:6789/usuario/1
```

**Resposta (200 OK):**
```json
{ "id": 1, "nome": "Ana Carolina Silva", "email": "ana.silva@email.com", "dataNascimento": "1992-03-15" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Usuário não encontrado" }
```

---

### 1.3 Criar Usuário
**POST** `/usuario`  
Cria um novo usuário no sistema.

**Body (JSON):**
```json
{ "nome": "João Silva", "email": "joao@email.com", "senha": "senha123", "dataNascimento": "1990-05-15" }
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/usuario \
-H "Content-Type: application/json" \
-d '{ "nome": "João Silva", "email": "joao@email.com", "senha": "senha123", "dataNascimento": "1990-05-15" }'
```

**Resposta (201 Created):**
```json
{ "message": "Usuário cadastrado com sucesso" }
```

**Resposta (409 Conflict):**
```json
{ "error": "Email já cadastrado" }
```

**Resposta (400 Bad Request):**
```json
{ "error": "Nome é obrigatório" }
```

---

### 1.4 Atualizar Usuário
**PUT** `/usuario/:id`  
Atualiza os dados de um usuário existente.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do usuário

**Body (JSON):**
```json
{ "nome": "João Silva Santos", "email": "joao.santos@email.com", "senha": "novaSenha123", "dataNascimento": "1990-05-15" }
```

**Exemplo de requisição:**
```bash
curl -X PUT http://localhost:6789/usuario/8 \
-H "Content-Type: application/json" \
-d '{ "nome": "João Silva Santos", "email": "joao.santos@email.com", "senha": "novaSenha123", "dataNascimento": "1990-05-15" }'
```

**Resposta (200 OK):**
```json
{ "message": "Usuário atualizado com sucesso" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Usuário não encontrado" }
```

---

### 1.5 Deletar Usuário
**DELETE** `/usuario/:id`  
Remove um usuário do sistema.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do usuário

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/usuario/8
```

**Resposta (200 OK):**
```json
{ "message": "Usuário removido com sucesso" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Usuário não encontrado" }
```

---

### 1.6 Login
**POST** `/usuario/login`  
Autentica um usuário no sistema.

**Body (JSON):**
```json
{ "email": "ana.silva@email.com", "senha": "$2b$10$xQYZ123...hashSenha1" }
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/usuario/login \
-H "Content-Type: application/json" \
-d '{ "email": "ana.silva@email.com", "senha": "$2b$10$xQYZ123...hashSenha1" }'
```

**Resposta (200 OK):**
```json
{ "id": 1, "nome": "Ana Carolina Silva", "email": "ana.silva@email.com", "dataNascimento": "1992-03-15" }
```

**Resposta (401 Unauthorized):**
```json
{ "error": "Credenciais inválidas" }
```


## 2. Alimento 🍎

### 2.1 Listar Todos os Alimentos
**GET** `/alimento`  
Lista todos os alimentos cadastrados, ordenados por categoria e nome.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/alimento
```

**Resposta (200 OK):**
```json
[
  { "id": 38, "nome": "Café em Pó", "categoria": "Bebidas" },
  { "id": 39, "nome": "Suco de Laranja", "categoria": "Bebidas" },
  { "id": 27, "nome": "Frango (Peito)", "categoria": "Carnes" },
  { "id": 28, "nome": "Carne Bovina (Patinho)", "categoria": "Carnes" },
  { "id": 22, "nome": "Banana", "categoria": "Frutas" },
  { "id": 23, "nome": "Maçã", "categoria": "Frutas" }
]
```

---

### 2.2 Buscar Alimento por ID
**GET** `/alimento/:id`  
Busca um alimento específico pelo ID.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do alimento

**Exemplo de requisição:**
```bash
curl http://localhost:6789/alimento/7
```

**Resposta (200 OK):**
```json
{ "id": 7, "nome": "Arroz Branco", "categoria": "Grãos" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Alimento não encontrado" }
```

---

### 2.3 Listar Alimentos por Categoria
**GET** `/alimento/categoria/:categoria`  
Lista todos os alimentos de uma categoria específica.

**Parâmetros:**
- `categoria` *(path, obrigatório)* – Nome da categoria

**Exemplo de requisição:**
```bash
curl http://localhost:6789/alimento/categoria/Frutas
```

**Resposta (200 OK):**
```json
[
  { "id": 22, "nome": "Banana", "categoria": "Frutas" },
  { "id": 24, "nome": "Laranja", "categoria": "Frutas" },
  { "id": 25, "nome": "Limão", "categoria": "Frutas" },
  { "id": 23, "nome": "Maçã", "categoria": "Frutas" },
  { "id": 26, "nome": "Morango", "categoria": "Frutas" }
]
```

---

### 2.4 Buscar Alimentos por Nome
**GET** `/alimento/search?q=termo`  
Busca alimentos que contenham o termo no nome *(case-insensitive)*.

**Parâmetros:**
- `q` *(query, obrigatório)* – Termo de busca

**Exemplo de requisição:**
```bash
curl "http://localhost:6789/alimento/search?q=arroz"
```

**Resposta (200 OK):**
```json
[
  { "id": 7, "nome": "Arroz Branco", "categoria": "Grãos" },
  { "id": 8, "nome": "Arroz Integral", "categoria": "Grãos" }
]
```

---

### 2.5 Listar Categorias Disponíveis
**GET** `/alimento/categorias`  
Lista todas as categorias de alimentos disponíveis.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/alimento/categorias
```

**Resposta (200 OK):**
```json
[
  "Bebidas",
  "Carnes",
  "Condimentos",
  "Frutas",
  "Grãos",
  "Laticínios",
  "Massas",
  "Padaria",
  "Proteínas",
  "Temperos",
  "Vegetais"
]
```

---

### 2.6 Criar Alimento
**POST** `/alimento`  
Cria um novo alimento no catálogo.

**Body (JSON):**
```json
{ "nome": "Abacate", "categoria": "Frutas" }
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/alimento \
-H "Content-Type: application/json" \
-d '{ "nome": "Abacate", "categoria": "Frutas" }'
```

**Resposta (201 Created):**
```json
{ "message": "Alimento cadastrado com sucesso" }
```

**Resposta (400 Bad Request):**
```json
{ "error": "Nome é obrigatório" }
```

---

### 2.7 Atualizar Alimento
**PUT** `/alimento/:id`  
Atualiza os dados de um alimento existente.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do alimento

**Body (JSON):**
```json
{ "nome": "Abacate Maduro", "categoria": "Frutas" }
```

**Exemplo de requisição:**
```bash
curl -X PUT http://localhost:6789/alimento/41 \
-H "Content-Type: application/json" \
-d '{ "nome": "Abacate Maduro", "categoria": "Frutas" }'
```

**Resposta (200 OK):**
```json
{ "message": "Alimento atualizado com sucesso" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Alimento não encontrado" }
```

---

### 2.8 Deletar Alimento
**DELETE** `/alimento/:id`  
Remove um alimento do catálogo.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do alimento

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/alimento/41
```

**Resposta (200 OK):**
```json
{ "message": "Alimento removido com sucesso" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Alimento não encontrado" }
```


## 3. Receita 🍳

### 3.1 Listar Todas as Receitas
**GET** `/receita`  
Lista todas as receitas cadastradas.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/receita
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Arroz Integral com Legumes",
    "porcao": "4 porções",
    "tempoPreparo": 35,
    "informacoes": {
      "ingredientes": [
        "2 xícaras de arroz integral",
        "1 cenoura picada",
        "1 brócolis pequeno",
        "1 cebola média",
        "2 dentes de alho",
        "3 xícaras de água",
        "Sal a gosto",
        "2 colheres de azeite"
      ],
      "modo_preparo": [
        "Refogue o alho e a cebola no azeite",
        "Adicione o arroz e refogue por 2 minutos",
        "Acrescente a água e o sal",
        "Quando ferver, adicione cenoura e brócolis",
        "Cozinhe em fogo baixo por 25 minutos"
      ],
      "dificuldade": "Fácil",
      "tipo_refeicao": "Almoço/Jantar",
      "calorias": 280,
      "tags": ["vegetariano", "saudável", "integral"]
    }
  },
  {
    "id": 2,
    "titulo": "Frango Grelhado com Salada",
    "porcao": "2 porções",
    "tempoPreparo": 25,
    "informacoes": {
      "ingredientes": [
        "2 filés de peito de frango",
        "1 alface americana",
        "2 tomates",
        "1 cebola roxa",
        "Suco de 1 limão",
        "Azeite a gosto",
        "Sal e pimenta do reino"
      ],
      "modo_preparo": [
        "Tempere o frango com sal, pimenta e limão",
        "Deixe marinar por 15 minutos",
        "Grelhe o frango por 10 minutos de cada lado",
        "Prepare a salada com alface, tomate e cebola",
        "Tempere com azeite e sal"
      ],
      "dificuldade": "Fácil",
      "tipo_refeicao": "Almoço/Jantar",
      "calorias": 350,
      "tags": ["proteico", "low-carb", "fitness"]
    }
  }
]
```

---

### 3.2 Buscar Receita por ID
**GET** `/receita/:id`  
Busca uma receita específica pelo ID.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl http://localhost:6789/receita/1
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "titulo": "Arroz Integral com Legumes",
  "porcao": "4 porções",
  "tempoPreparo": 35,
  "informacoes": {
    "ingredientes": [
      "2 xícaras de arroz integral",
      "1 cenoura picada",
      "1 brócolis pequeno",
      "1 cebola média",
      "2 dentes de alho",
      "3 xícaras de água",
      "Sal a gosto",
      "2 colheres de azeite"
    ],
    "modo_preparo": [
      "Refogue o alho e a cebola no azeite",
      "Adicione o arroz e refogue por 2 minutos",
      "Acrescente a água e o sal",
      "Quando ferver, adicione cenoura e brócolis",
      "Cozinhe em fogo baixo por 25 minutos"
    ],
    "dificuldade": "Fácil",
    "tipo_refeicao": "Almoço/Jantar",
    "calorias": 280,
    "tags": ["vegetariano", "saudável", "integral"]
  }
}
```

**Resposta (404 Not Found):**
```json
{ "error": "Receita não encontrada" }
```

---

### 3.3 Buscar Receitas por Título
**GET** `/receita/search?q=termo`  
Busca receitas que contenham o termo no título *(case-insensitive)*.

**Parâmetros:**
- `q` *(query, obrigatório)* – Termo de busca

**Exemplo de requisição:**
```bash
curl "http://localhost:6789/receita/search?q=frango"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 2,
    "titulo": "Frango Grelhado com Salada",
    "porcao": "2 porções",
    "tempoPreparo": 25,
    "informacoes": {
      "ingredientes": [
        "2 filés de peito de frango",
        "1 alface americana",
        "2 tomates",
        "1 cebola roxa",
        "Suco de 1 limão",
        "Azeite a gosto",
        "Sal e pimenta do reino"
      ],
      "modo_preparo": [
        "Tempere o frango com sal, pimenta e limão",
        "Deixe marinar por 15 minutos",
        "Grelhe o frango por 10 minutos de cada lado",
        "Prepare a salada com alface, tomate e cebola",
        "Tempere com azeite e sal"
      ],
      "dificuldade": "Fácil",
      "tipo_refeicao": "Almoço/Jantar",
      "calorias": 350,
      "tags": ["proteico", "low-carb", "fitness"]
    }
  }
]
```

---

### 3.4 Buscar Receitas por Tempo Máximo
**GET** `/receita/tempo/:tempo`  
Busca receitas com tempo de preparo até o valor especificado.

**Parâmetros:**
- `tempo` *(path, obrigatório)* – Tempo máximo em minutos

**Exemplo de requisição:**
```bash
curl http://localhost:6789/receita/tempo/20
```

**Resposta (200 OK):**
```json
[
  {
    "id": 6,
    "titulo": "Smoothie de Frutas",
    "porcao": "2 copos",
    "tempoPreparo": 5,
    "informacoes": {
      "ingredientes": [
        "1 banana congelada",
        "10 morangos",
        "1 copo de leite",
        "1 colher de mel",
        "Gelo a gosto"
      ],
      "modo_preparo": [
        "Coloque todos os ingredientes no liquidificador",
        "Bata até ficar homogêneo",
        "Sirva imediatamente"
      ],
      "dificuldade": "Muito Fácil",
      "tipo_refeicao": "Café da Manhã/Lanche",
      "calorias": 180,
      "tags": ["saudável", "rápido", "refrescante", "vegetariano"]
    }
  },
  {
    "id": 4,
    "titulo": "Omelete Proteica",
    "porcao": "1 porção",
    "tempoPreparo": 10,
    "informacoes": {
      "ingredientes": [
        "3 ovos",
        "1 tomate picado",
        "1/4 de cebola",
        "Queijo mussarela",
        "Sal e orégano",
        "1 colher de azeite"
      ],
      "modo_preparo": [
        "Bata os ovos com sal",
        "Adicione tomate e cebola picados",
        "Aqueça uma frigideira com azeite",
        "Despeje a mistura e espalhe",
        "Adicione queijo, dobre e sirva"
      ],
      "dificuldade": "Muito Fácil",
      "tipo_refeicao": "Café da Manhã/Lanche",
      "calorias": 280,
      "tags": ["proteico", "rápido", "fitness"]
    }
  },
  {
    "id": 8,
    "titulo": "Salada Caesar",
    "porcao": "2 porções",
    "tempoPreparo": 15,
    "informacoes": {
      "ingredientes": [
        "1 alface romana",
        "100g de peito de frango grelhado",
        "Queijo parmesão ralado",
        "Croutons",
        "Molho caesar",
        "Limão"
      ],
      "modo_preparo": [
        "Lave e rasgue a alface",
        "Corte o frango em tiras",
        "Misture alface, frango e croutons",
        "Adicione o molho caesar",
        "Finalize com parmesão e limão"
      ],
      "dificuldade": "Fácil",
      "tipo_refeicao": "Almoço/Jantar",
      "calorias": 290,
      "tags": ["salada", "proteico", "rápido"]
    }
  }
]
```
### 3.5 Buscar Receitas por Tag
**GET** `/receita/tag/:tag`  
Busca receitas que contenham a tag especificada.

**Parâmetros:**
- `tag` *(path, obrigatório)* – Nome da tag

**Exemplo de requisição:**
```bash
curl http://localhost:6789/receita/tag/vegetariano
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Arroz Integral com Legumes",
    "porcao": "4 porções",
    "tempoPreparo": 35,
    "informacoes": {
      "tags": ["vegetariano", "saudável", "integral"]
    }
  },
  {
    "id": 3,
    "titulo": "Macarrão ao Molho de Tomate",
    "porcao": "3 porções",
    "tempoPreparo": 20,
    "informacoes": {
      "tags": ["vegetariano", "italiano", "rápido"]
    }
  },
  {
    "id": 6,
    "titulo": "Smoothie de Frutas",
    "porcao": "2 copos",
    "tempoPreparo": 5,
    "informacoes": {
      "tags": ["saudável", "rápido", "refrescante", "vegetariano"]
    }
  }
]
```

---

### 3.6 Criar Receita
**POST** `/receita`  
Cria uma nova receita no sistema.

**Body (JSON):**
```json
{
  "titulo": "Tapioca com Queijo",
  "porcao": "1 porção",
  "tempoPreparo": 10,
  "informacoes": {
    "ingredientes": [
      "3 colheres de goma de tapioca",
      "50g de queijo mussarela",
      "Sal a gosto"
    ],
    "modo_preparo": [
      "Aqueça uma frigideira antiaderente",
      "Polvilhe a tapioca formando um círculo",
      "Adicione o queijo quando começar a grudar",
      "Dobre ao meio e sirva quente"
    ],
    "dificuldade": "Muito Fácil",
    "tipo_refeicao": "Café da Manhã/Lanche",
    "calorias": 220,
    "tags": ["rápido", "sem glúten", "lanche"]
  }
}
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/receita \
-H "Content-Type: application/json" \
-d '{ "titulo": "Tapioca com Queijo", "porcao": "1 porção", "tempoPreparo": 10, "informacoes": { "ingredientes": ["3 colheres de goma de tapioca", "50g de queijo mussarela"], "modo_preparo": ["Aqueça uma frigideira", "Polvilhe a tapioca"], "dificuldade": "Muito Fácil", "calorias": 220, "tags": ["rápido", "sem glúten"] } }'
```

**Resposta (201 Created):**
```json
{ "message": "Receita cadastrada com sucesso" }
```

---

### 3.7 Atualizar Receita
**PUT** `/receita/:id`  
Atualiza os dados de uma receita existente.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl -X PUT http://localhost:6789/receita/9 \
-H "Content-Type: application/json" \
-d '{ "titulo": "Tapioca com Queijo e Tomate", "porcao": "1 porção", "tempoPreparo": 12, "informacoes": { "ingredientes": ["3 colheres de goma de tapioca", "50g de queijo", "1 tomate"], "tags": ["rápido", "sem glúten", "saudável"] } }'
```

**Resposta (200 OK):**
```json
{ "message": "Receita atualizada com sucesso" }
```

---

### 3.8 Deletar Receita
**DELETE** `/receita/:id`  
Remove uma receita do sistema.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/receita/9
```

**Resposta (200 OK):**
```json
{ "message": "Receita removida com sucesso" }
```


## 4. Registra (Compras) 📦

### 4.1 Listar Todos os Registros
**GET** `/registra`  
Lista todos os registros de compras com informações de alimento e usuário.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/registra
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "alimentoId": 1,
    "usuarioId": 1,
    "nomeAlimento": "Leite Integral",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2025-10-25",
    "unidadeMedida": "Litros",
    "lote": "L2025101501",
    "quantidade": 2.0
  },
  {
    "id": 2,
    "alimentoId": 7,
    "usuarioId": 1,
    "nomeAlimento": "Arroz Branco",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2026-04-18",
    "unidadeMedida": "Kg",
    "lote": "A2025100215",
    "quantidade": 5.0
  }
]
```

---

### 4.2 Buscar Registro por ID
**GET** `/registra/:id`  
Busca um registro específico pelo ID.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do registro

**Exemplo de requisição:**
```bash
curl http://localhost:6789/registra/1
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "alimentoId": 1,
  "usuarioId": 1,
  "nomeAlimento": "Leite Integral",
  "nomeUsuario": "Ana Carolina Silva",
  "dataCompra": "2025-10-18",
  "dataValidade": "2025-10-25",
  "unidadeMedida": "Litros",
  "lote": "L2025101501",
  "quantidade": 2.0
}
```

---

### 4.3 Listar Registros por Usuário
**GET** `/registra/usuario/:usuarioId`  
Lista todos os registros de compras de um usuário específico.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário

**Exemplo de requisição:**
```bash
curl http://localhost:6789/registra/usuario/1
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "alimentoId": 1,
    "usuarioId": 1,
    "nomeAlimento": "Leite Integral",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2025-10-25",
    "unidadeMedida": "Litros",
    "lote": "L2025101501",
    "quantidade": 2.0
  },
  {
    "id": 2,
    "alimentoId": 7,
    "usuarioId": 1,
    "nomeAlimento": "Arroz Branco",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2026-04-18",
    "unidadeMedida": "Kg",
    "lote": "A2025100215",
    "quantidade": 5.0
  },
  {
    "id": 3,
    "alimentoId": 9,
    "usuarioId": 1,
    "nomeAlimento": "Feijão Preto",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2026-10-18",
    "unidadeMedida": "Kg",
    "lote": "F2025092801",
    "quantidade": 1.0
  }
]
```

---

### 4.4 Produtos Próximos ao Vencimento
**GET** `/registra/usuario/:usuarioId/vencimento/:dias`  
Lista produtos que vencem nos próximos X dias para um usuário.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário
- `dias` *(path, obrigatório)* – Número de dias

**Exemplo de requisição:**  
Produtos que vencem nos próximos 7 dias:
```bash
curl http://localhost:6789/registra/usuario/1/vencimento/7
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "alimentoId": 1,
    "usuarioId": 1,
    "nomeAlimento": "Leite Integral",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-18",
    "dataValidade": "2025-10-25",
    "unidadeMedida": "Litros",
    "lote": "L2025101501",
    "quantidade": 2.0
  },
  {
    "id": 4,
    "alimentoId": 14,
    "usuarioId": 1,
    "nomeAlimento": "Tomate",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-19",
    "dataValidade": "2025-10-26",
    "unidadeMedida": "Kg",
    "lote": null,
    "quantidade": 1.5
  }
]
```

---

### 4.5 Produtos Vencidos
**GET** `/registra/usuario/:usuarioId/vencidos`  
Lista produtos vencidos de um usuário.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário

**Exemplo de requisição:**
```bash
curl http://localhost:6789/registra/usuario/1/vencidos
```

**Resposta (200 OK):**
```json
[
  {
    "id": 50,
    "alimentoId": 1,
    "usuarioId": 1,
    "nomeAlimento": "Leite Integral",
    "nomeUsuario": "Ana Carolina Silva",
    "dataCompra": "2025-10-01",
    "dataValidade": "2025-10-08",
    "unidadeMedida": "Litros",
    "lote": "L2025100101",
    "quantidade": 1.0
  }
]
```

---

### 4.6 Registrar Compra
**POST** `/registra`  
Registra uma nova compra de alimento.

**Body (JSON):**
```json
{
  "alimentoId": 7,
  "usuarioId": 1,
  "dataCompra": "2025-10-21",
  "dataValidade": "2026-04-21",
  "unidadeMedida": "Kg",
  "lote": "A2025102101",
  "quantidade": 5.0
}
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/registra \
-H "Content-Type: application/json" \
-d '{ "alimentoId": 7, "usuarioId": 1, "dataCompra": "2025-10-21", "dataValidade": "2026-04-21", "unidadeMedida": "Kg", "lote": "A2025102101", "quantidade": 5.0 }'
```

**Resposta (201 Created):**
```json
{ "message": "Registro cadastrado com sucesso" }
```

**Resposta (400 Bad Request):**
```json
{ "error": "Alimento é obrigatório" }
```

---

### 4.7 Atualizar Registro
**PUT** `/registra/:id`  
Atualiza os dados de um registro de compra existente.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do registro

**Body (JSON):**
```json
{
  "alimentoId": 7,
  "usuarioId": 1,
  "dataCompra": "2025-10-21",
  "dataValidade": "2026-04-21",
  "unidadeMedida": "Kg",
  "lote": "A2025102101",
  "quantidade": 3.0
}
```

**Exemplo de requisição:**
```bash
curl -X PUT http://localhost:6789/registra/43 \
-H "Content-Type: application/json" \
-d '{ "alimentoId": 7, "usuarioId": 1, "dataCompra": "2025-10-21", "dataValidade": "2026-04-21", "unidadeMedida": "Kg", "quantidade": 3.0 }'
```

**Resposta (200 OK):**
```json
{ "message": "Registro atualizado com sucesso" }
```

---

### 4.8 Deletar Registro
**DELETE** `/registra/:id`  
Remove um registro de compra.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do registro

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/registra/43
```

**Resposta (200 OK):**
```json
{ "message": "Registro removido com sucesso" }
```


## 5. Receitas Favoritas ⭐

### 5.1 Listar Todas as Receitas Favoritas
**GET** `/favoritas`  
Lista todas as receitas favoritas do sistema.

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuarioId": 1,
    "receitaId": 1,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Arroz Integral com Legumes",
    "dataAdicao": "2025-10-21T14:30:00"
  },
  {
    "id": 2,
    "usuarioId": 1,
    "receitaId": 2,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Frango Grelhado com Salada",
    "dataAdicao": "2025-10-21T14:35:00"
  },
  {
    "id": 3,
    "usuarioId": 1,
    "receitaId": 6,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Smoothie de Frutas",
    "dataAdicao": "2025-10-21T14:40:00"
  }
]
```

---

### 5.2 Buscar Favorita por ID
**GET** `/favoritas/:id`  
Busca uma receita favorita específica pelo ID.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do favorito

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas/1
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "usuarioId": 1,
  "receitaId": 1,
  "nomeUsuario": "Ana Carolina Silva",
  "tituloReceita": "Arroz Integral com Legumes",
  "dataAdicao": "2025-10-21T14:30:00"
}
```

---

### 5.3 Listar Favoritas de um Usuário
**GET** `/favoritas/usuario/:usuarioId`  
Lista todas as receitas favoritas de um usuário específico.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas/usuario/1
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuarioId": 1,
    "receitaId": 1,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Arroz Integral com Legumes",
    "dataAdicao": "2025-10-21T14:30:00"
  },
  {
    "id": 2,
    "usuarioId": 1,
    "receitaId": 2,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Frango Grelhado com Salada",
    "dataAdicao": "2025-10-21T14:35:00"
  },
  {
    "id": 3,
    "usuarioId": 1,
    "receitaId": 6,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Smoothie de Frutas",
    "dataAdicao": "2025-10-21T14:40:00"
  }
]
```

---

### 5.4 Listar Usuários que Favoritaram uma Receita
**GET** `/favoritas/receita/:receitaId`  
Lista todos os usuários que favoritaram uma receita específica.

**Parâmetros:**
- `receitaId` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas/receita/1
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "usuarioId": 1,
    "receitaId": 1,
    "nomeUsuario": "Ana Carolina Silva",
    "tituloReceita": "Arroz Integral com Legumes",
    "dataAdicao": "2025-10-21T14:30:00"
  },
  {
    "id": 8,
    "usuarioId": 3,
    "receitaId": 1,
    "nomeUsuario": "Carla Fernandes",
    "tituloReceita": "Arroz Integral com Legumes",
    "dataAdicao": "2025-10-21T16:20:00"
  },
  {
    "id": 14,
    "usuarioId": 6,
    "receitaId": 1,
    "nomeUsuario": "Felipe Almeida",
    "tituloReceita": "Arroz Integral com Legumes",
    "dataAdicao": "2025-10-21T18:10:00"
  }
]
```

---

### 5.5 Verificar se Receita é Favorita
**GET** `/favoritas/check/:usuarioId/:receitaId`  
Verifica se uma receita está nos favoritos de um usuário.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário
- `receitaId` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas/check/1/3
```

**Resposta (200 OK) - É favorita:**
```json
{ "isFavorita": true }
```

**Resposta (200 OK) - Não é favorita:**
```json
{ "isFavorita": false }
```

---

### 5.6 Contar Favoritos de uma Receita
**GET** `/favoritas/receita/:receitaId/count`  
Conta quantos usuários favoritaram uma receita.

**Parâmetros:**
- `receitaId` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl http://localhost:6789/favoritas/receita/1/count
```

**Resposta (200 OK):**
```json
{ "count": 3 }
```

---

### 5.7 Adicionar aos Favoritos
**POST** `/favoritas`  
Adiciona uma receita aos favoritos de um usuário.

**Body (JSON):**
```json
{ "usuarioId": 1, "receitaId": 3 }
```

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:6789/favoritas \
-H "Content-Type: application/json" \
-d '{ "usuarioId": 1, "receitaId": 3 }'
```

**Resposta (201 Created):**
```json
{ "message": "Receita adicionada aos favoritos" }
```

**Resposta (409 Conflict):**
```json
{ "error": "Receita já está nos favoritos" }
```

**Resposta (400 Bad Request):**
```json
{ "error": "Usuário é obrigatório" }
```

---

### 5.8 Remover dos Favoritos (por ID)
**DELETE** `/favoritas/:id`  
Remove uma receita dos favoritos usando o ID do registro.

**Parâmetros:**
- `id` *(path, obrigatório)* – ID do favorito

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/favoritas/20
```

**Resposta (200 OK):**
```json
{ "message": "Receita removida dos favoritos" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Favorita não encontrada" }
```

---

### 5.9 Remover dos Favoritos (por Usuário e Receita)
**DELETE** `/favoritas/usuario/:usuarioId/receita/:receitaId`  
Remove uma receita dos favoritos usando ID do usuário e ID da receita.

**Parâmetros:**
- `usuarioId` *(path, obrigatório)* – ID do usuário
- `receitaId` *(path, obrigatório)* – ID da receita

**Exemplo de requisição:**
```bash
curl -X DELETE http://localhost:6789/favoritas/usuario/1/receita/3
```

**Resposta (200 OK):**
```json
{ "message": "Receita removida dos favoritos" }
```

**Resposta (404 Not Found):**
```json
{ "error": "Receita não está nos favoritos" }
```


## Estrutura do Projeto 📁
```
smart-routine-api/
├── src/
│   └── main/
│       └── java/
│           ├── app/
│           │   └── Aplicacao.java          # Servidor e rotas
│           ├── dao/
│           │   ├── DAO.java                # Classe base (conexão)
│           │   ├── UsuarioDAO.java         # CRUD Usuário
│           │   ├── AlimentoDAO.java        # CRUD Alimento
│           │   ├── ReceitaDAO.java         # CRUD Receita
│           │   ├── RegistraDAO.java        # CRUD Registra
│           │   └── ReceitaFavoritaDAO.java # CRUD Favoritas
│           ├── db/
│           │   ├── schema.sql              # Estrutura do banco
│           │   └── seed.sql                # Dados iniciais
│           ├── model/
│           │   ├── Usuario.java            # Entidade Usuário
│           │   ├── Alimento.java           # Entidade Alimento
│           │   ├── Receita.java            # Entidade Receita
│           │   ├── Registra.java           # Entidade Registra
│           │   └── ReceitaFavorita.java    # Entidade Favoritas
│           ├── service/
│           │   ├── UsuarioService.java     # Lógica de negócio
│           │   ├── AlimentoService.java
│           │   ├── ReceitaService.java
│           │   ├── RegistraService.java
│           │   └── ReceitaFavoritaService.java
│           └── util/
│               └── DatabaseInitializer.java # Inicializador do DB
├── pom.xml                                  # Configuração Maven
├── README.md                                # Este arquivo
└── .gitignore
```

Resumo da API 📊

| Entidade  | Endpoints | Recursos                  |
|:---------:|:---------:|:--------------------------|
|  Usuario  |     6     | Cadastro, login, CRUD     |
| Alimento  |     8     | CRUD, busca, categorias   |
|  Receita  |     8     | CRUD, busca, filtros      |
| Registra  |     8     | CRUD, alertas de validade |
| Favoritas |     9     | CRUD, verificações        |
| **TOTAL** |  **39**   | **Endpoints completos**   |


**Desenvolvido por SmartRoutine**
