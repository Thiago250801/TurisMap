import teatroAmazonas from "../assets/Teatro_Amazonas.jpg";
import heroAmazon from "../assets/hero-amazon2.jpg"
import pontaNegra from "../assets/Ponta_Negra.jpg";
import encontroAguas from "../assets/Encontro_Aguas.jpg";
import artesanatoIndigena from "../assets/Artesanato_Indigena.jpeg";
import passeioBarco from "../assets/Passeio_Barco.jpg";

import {
  Globe,
  Landmark,
  TreePine,
  Compass,
  Palette,
} from "lucide-react-native";
import { ImageSourcePropType } from "react-native";

export interface Place {
  id: string;
  title: string;
  location: string;
  rating: number;
  image: ImageSourcePropType;
  description: string;
  category: "cultural" | "nature" | "adventure" | "craft";
  sellerId?: string;
  sellerName?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType;
  description: string;
  seller: string;
  available: boolean;
}

export interface TravelPlan {
  id: string;
  name: string;
  places: string[];
  startDate: string;
  endDate: string;
  offline: boolean;
}

export const heroImage = heroAmazon;

export const suggestions: Place[] = [
  {
    id: "1",
    title: "Teatro Amazonas",
    location: "Manaus, AM",
    rating: 4.8,
    image: teatroAmazonas,
    description:
      "O Teatro Amazonas é um teatro brasileiro localizado no centro de Manaus, capital do estado do Amazonas. É a mais importante casa de espetáculos da região Norte do Brasil.",
    category: "cultural",
    sellerId: "seller-1",
    sellerName: "Manaus Cultural",
  },
  {
    id: "2",
    title: "Praia da Ponta Negra",
    location: "Manaus, AM",
    rating: 4.5,
    image: pontaNegra,
    description:
      "A Praia da Ponta Negra é uma das praias mais famosas de Manaus, com águas escuras características do Rio Negro e infraestrutura completa para visitantes.",
    category: "nature",
  },
  {
    id: "3",
    title: "Encontro das Águas",
    location: "Manaus, AM",
    rating: 4.9,
    image: encontroAguas,
    description:
      "Fenômeno natural único onde as águas escuras do Rio Negro encontram as águas barrentas do Rio Solimões, correndo lado a lado sem se misturar por quilômetros.",
    category: "nature",
    sellerId: "seller-2",
    sellerName: "Amazon Tours",
  },
];

export const popularPlaces: Place[] = [
  {
    id: "4",
    title: "Artesanato Indígena",
    location: "Centro, Manaus",
    rating: 4.7,
    image: artesanatoIndigena,
    description:
      "Peças artesanais feitas por comunidades indígenas locais, incluindo bijuterias, cestos, e objetos de decoração com materiais da floresta.",
    category: "craft",
    sellerId: "seller-3",
    sellerName: "Bijuteria Indígena",
  },
  {
    id: "5",
    title: "Passeio de Barco",
    location: "Rio Negro",
    rating: 4.6,
    image: passeioBarco,
    description:
      "Navegue pelos rios amazônicos em barcos tradicionais, conhecendo comunidades ribeirinhas e a fauna e flora da região.",
    category: "adventure",
    sellerId: "seller-2",
    sellerName: "Amazon Tours",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    title: "Passeio de Barco - Encontro das Águas",
    price: 150,
    image: passeioBarco,
    description:
      "Passeio de 4 horas pelos rios Negro e Solimões, incluindo parada para ver botos.",
    seller: "Amazon Tours",
    available: true,
  },
  {
    id: "p2",
    title: "Colar Indígena Artesanal",
    price: 89,
    image: artesanatoIndigena,
    description:
      "Colar feito à mão por artesãs da tribo Dessana, com sementes da Amazônia.",
    seller: "Bijuteria Indígena",
    available: true,
  },
  {
    id: "p3",
    title: "Tour Teatro Amazonas",
    price: 45,
    image: teatroAmazonas,
    description:
      "Visita guiada pelo Teatro Amazonas com história e curiosidades.",
    seller: "Manaus Cultural",
    available: true,
  },
];

export const mockPlans: TravelPlan[] = [];

export const categories = [
  { id: "all", name: "Todos", icon: Globe },
  { id: "cultural", name: "Cultural", icon: Landmark },
  { id: "nature", name: "Natureza", icon: TreePine },
  { id: "adventure", name: "Aventura", icon: Compass },
  { id: "craft", name: "Artesanato", icon: Palette },
];
