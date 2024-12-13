import dotenv from "dotenv";
dotenv.config();
import app from './app';
import mongooseConnection from "./config/database";
import Article from "./models/article";

mongooseConnection();

const PORT = parseInt(process.env.PORT || "3006", 10);
const HOST = process.env.HOST || '0.0.0.0';

const publishScheduledArticles = async () => {
  // console.log("Checking for articles to publish...");
  const now = new Date();
  const articlesToPublish = await Article.find({ 
      publish_date: { $lte: now }, 
      status: 'pending' 
  });

  // Update articles to 'published' status
  articlesToPublish.forEach(async (article) => {
      article.status = 'published';
      await article.save();
      // console.log(`Article "${article.title}" has been published.`);
  });
};

setInterval(publishScheduledArticles, 10000);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
