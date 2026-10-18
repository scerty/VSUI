import { type FC } from 'react';
import NewsDetails from '../components/news/NewsDetails';

interface NewsDetailsPageProps {
  news: any;
  onBack: () => void;
}

const NewsDetailsPage: FC<NewsDetailsPageProps> = ({ news, onBack }) => {
  return (
    <div>
      <NewsDetails news={news} onBack={onBack} />
    </div>
  );
};

export default NewsDetailsPage;
