import teatroAmazonas from "../assets/Teatro_Amazonas.jpg";
import heroAmazon from "../assets/hero-amazon2.jpg"
import pontaNegra from "../assets/Ponta_Negra.jpg";
import encontroAguas from "../assets/Encontro_Aguas.jpg";
import passeioBarco from "../assets/Passeio_Barco.jpg";
import mercadoMunicipal from "../assets/Mercado_Municipal.jpg";
import triboDessana from "../assets/Tribo_Dessana2.jpg";
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
  },

];

export const popularPlaces: Place[] = [
    {
    id: "1",
    title: "Teatro Amazonas",
    location: "Manaus, AM",
    rating: 4.8,
    image: teatroAmazonas,
    description:
      "O Teatro Amazonas é um teatro brasileiro localizado no centro de Manaus, capital do estado do Amazonas. É a mais importante casa de espetáculos da região Norte do Brasil.",
    category: "cultural",
  },
  {
    id: "4",
    title: "Mercado Municipal Adolpho Lisboa",
    location: "Centro, Manaus",
    rating: 4.6,
    image: mercadoMunicipal,
    description:
      "Mercado histórico com arquitetura art nouveau, oferecendo produtos típicos da região amazônica.",
    category: "cultural",
  },
  {
    id: "5",
    title: "Tribo Dessana",
    location: "Manaus, AM",
    rating: 4.7,
    image: triboDessana,
    description:
      "Tribo indígena que vive no entorno da cidade de Manaus, conhecida por sua cultura rica e tradições milenares.",
    category: "cultural",
  }

];

export const categories = [
  { id: "all", name: "Todos", icon: Globe },
  { id: "cultural", name: "Cultural", icon: Landmark },
  { id: "nature", name: "Natureza", icon: TreePine },
  { id: "adventure", name: "Aventura", icon: Compass },
  { id: "craft", name: "Artesanato", icon: Palette },
];
