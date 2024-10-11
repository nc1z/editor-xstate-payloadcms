import { updateArticleState } from "../services/articleService";

const handleArticleStateTransition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const updatedArticle = await updateArticleState(req.payload, id, action);

    res.status(200).json({ success: true, state: updatedArticle.state });
  } catch (error) {
    next(error);
  }
};

export default handleArticleStateTransition;
