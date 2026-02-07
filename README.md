# TurisMap

Aplicativo de turismo para Manaus/AM desenvolvido em React Native com Expo, Firebase e TypeScript.

## Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática
- **Firebase** - Backend (Authentication, Firestore)
- **Zustand** - Gerenciamento de estado
- **React Navigation** - Navegação
- **React Hook Form** - Formulários
- **Lucide React Native** - Ícones

## Requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Conta Firebase

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (Email/Password)
3. Ative **Firestore Database**
4. Copie as credenciais do projeto
5. Crie um arquivo `.env.local` copiando o arquivo de exemplo `.env.example` e preencha as variáveis:

```env
# Copie .env.example para .env.local e preencha os valores
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Observações importantes:
- Não comite o arquivo `.env.local` (ele deve permanecer local e privado).
- O repositório inclui um `.env.example` com placeholders para você copiar.
- O app faz uma checagem em tempo de execução e exibirá um aviso no console se alguma variável EXPO_PUBLIC_FIREBASE_* estiver faltando — isso ajuda a detectar configuração incorreta rapidamente.

### 3. Configurar Firestore

Crie as seguintes coleções no Firestore:

- **users** - Perfis de usuários
- **products** - Produtos dos comerciantes
- **favorites** - Favoritos dos turistas
- **plans** - Planos de viagem

## Executar

```bash
# Desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Estrutura do Projeto

```
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── data/              # Dados mockados (places)
│   ├── model/             # Modelos de dados
│   ├── routes/            # Configuração de rotas
│   ├── screens/           # Telas do app
│   │   ├── seller/        # Telas do comerciante
│   │   └── tourist/       # Telas do turista
│   ├── services/          # Serviços (Firebase, APIs)
│   ├── store/             # Stores Zustand
│   └── theme/             # Cores e estilos globais
├── assets/                # Imagens e fontes
├── .env.example           # Exemplo de variáveis (copiar para .env.local)
├── .env.local             # Variáveis de ambiente locais (NÃO COMITAR) — copie de .env.example e preencha
└── App.tsx                # Entrada do app
```

## Funcionalidades

### Turista

- Autenticação (Login/Registro)
- Explorar lugares turísticos (mockados)
- Buscar produtos e experiências
- Favoritar lugares e produtos
- Criar planos de viagem com modo offline
- Visualizar detalhes de produtos

### Comerciante

- Autenticação (Login/Registro)
- Cadastrar produtos com imagens (Base64)
- Gerenciar catálogo de produtos
- Atualizar informações da loja
- Visualizar vitrine

## Firebase Collections

### users
```typescript
{
  id: string;
  email: string;
  name: string;
  type: "tourist" | "seller";
  createdAt: string;
  photoURL?: string;
}
```

### products
```typescript
{
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  price: number;
  description: string;
  image?: string; // Base64
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### favorites
```typescript
{
  id: string;
  userId: string;
  placeId: string;
  title: string;
  rating: number;
  image: string;
  createdAt: string;
}
```

### plans
```typescript
{
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  offline: boolean;
  places: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Observações

- As imagens dos produtos são armazenadas como Base64 no Firestore
- Os lugares turísticos permanecem mockados (não estão no Firestore)
- O app usa persistência local com AsyncStorage para dados offline
