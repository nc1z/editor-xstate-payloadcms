export interface Article {
  title: string;
  content: { children: { text: string }[] }[];
  state: string;
  id: string;
}
