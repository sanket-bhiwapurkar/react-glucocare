import "./index.css";
import { GiMedicines } from "react-icons/gi";
import { BsFillDropletFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderData = [
  {
    id: 1,
    imgUrl:
      "https://lirp.cdn-website.com/3e6bbd31/dms3rep/multi/opt/doctor-examining-senior-patient-blood-sugar-QKLHT32-1920w.jpg",
    blogUrl:
      "https://www.ocanamedicalcenter.com/the-prevalence-and-prevention-of-diabetes-in-seniors",
    title: "The Prevalence and Prevention of Diabetes in Seniors",
  },
  {
    id: 2,
    imgUrl:
      "https://www.endocrine.org/-/media/endocrine/images/patient-engagement-webpage/condition-page-images/diabetes-and-glucose-metabolism/diabetes_and_older_adults_pe_1796x943.jpg?w=1290&hash=486FD19124314ED6B1A58B7B633CF8DB",
    blogUrl:
      "https://www.endocrine.org/patient-engagement/endocrine-library/diabetes-and-older-adults",
    title: "Diabetes and Older Adults",
  },
  {
    id: 3,
    imgUrl:
      "https://kffhealthnews.org/wp-content/uploads/sites/2/2022/06/GettyImages-1191405472.jpeg?resize=1270,847",
    blogUrl:
      "https://kffhealthnews.org/news/article/seniors-with-prediabetes-should-eat-better-get-moving-but-not-fret-too-much-about-diabetes/",
    title:
      "Seniors With Prediabetes Should Eat Better, Get Moving, but Not Fret Too Much About Diabetes",
  },
];

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <NavBar />
      <div className="slider-container">
        <Slider {...settings}>
          {sliderData.map((eachSlide) => (
            <div key={eachSlide.id} className="slider-item-container">
              <div className="slider-title-container">
                <h1 className="slider-title">{eachSlide.title}</h1>
              </div>
              <a
                href={eachSlide.blogUrl}
                rel="noreferrer"
                target="_blank"
                className="link-img-container"
              >
                <img
                  src={eachSlide.imgUrl}
                  alt="blogs"
                  className="slider-img"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
      <div className="home-body">
        <Link to="/add-medicine-reminder" className="home-links">
          <div className="add-medicine-reminder-container">
            <div className="add-medicine-icon-container">
              <GiMedicines size={25} />
            </div>
            <p className="add-medicine-reminder-title">New Medicine Reminder</p>
            <button type="button" className="add-medicine-reminder-button">
              +Add
            </button>
          </div>
        </Link>
        <Link to="/add-glucose-level" className="home-links">
          <div className="add-glucose-level-container">
            <div className="add-glucose-icon-container">
              <BsFillDropletFill size={25} />
            </div>
            <p className="add-glucose-level-title">New Glucose Level</p>
            <button type="button" className="add-glucose-level-button">
              +Add
            </button>
          </div>
        </Link>
        <Link to="/add-appointment" className="home-links">
          <div className="add-appointment-reminder-container">
            <div className="add-appointment-icon-container">
              <AiOutlineSchedule size={25} />
            </div>
            <p className="add-appointment-title">New Appointment</p>
            <button type="button" className="add-new-appointment-button">
              +Add
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
