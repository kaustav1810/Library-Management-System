import ReviewModel from "../../models/ReviewModel";
import { StarsReview } from "./StarsReview";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
  const datetime = new Date(props.review.date);

  const longMonth = datetime.toLocaleString("en-us", { month: "long" });

  const year = datetime.getFullYear();

  const date = datetime.getDate();

  const timestamp = `${longMonth} ${date},${year}`;

  return (
    <div>
      <div className="col-sm-8 col-md-8">
        <h5>{props.review.userEmail?.replaceAll("\"","")}</h5>
        <div className="row">
          <div className="col">{timestamp}</div>

          <div className="col">
            <StarsReview size={16} rating={props.review.rating} />
          </div>
        </div>
        <div className="mt-2">
          <p>{props.review.reviewDescription}</p>
        </div>
      </div>
      <hr />
    </div>
  );
};
