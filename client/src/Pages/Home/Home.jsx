import React, { useContext, useState, useEffect } from "react";
import styles from "./home.module.css";
import axios from "../../Utility/axios";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { FaSearchengin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { ClipLoader } from "react-spinners";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function Home() {
  const { userData, setUserData } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = userData?.token;




  const handleAskQuestion = () => {
    if (!token || !userData?.userid) {
      navigate("/landing", {
        state: { message: "Please login to ask a question" },
      });
    } else {
      navigate("/ask-questions");
    }
  };




  useEffect(() => {
    setLoading(true);
    // Fetch questions from the API
    axios
      .get(
        `/question?page=${page}&pageSize=${pageSize}&sort=${sort}&search=${encodeURIComponent(
          search
        )}`
      )
      .then((res) => {
        if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
          setPagination(
            res.data.pagination || {
              total: 0,
              page: 1,
              pageSize: 5,
              totalPages: 1,
            }
          );
        } else {
          setQuestions([]);
          setPagination({ total: 0, page: 1, pageSize: 5, totalPages: 1 });
        }
      })
      .catch((err) => {
        setQuestions([]);
        setPagination({ total: 0, page: 1, pageSize: 5, totalPages: 1 });
        toast.error("Failed to load questions. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, pageSize, sort, search]);





  
  //  Vote handle
  const handleVote = async (question_id, action) => {
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await axios.post(`/questions/${question_id}/${action}`);
      const { likes, dislikes } = res.data;

      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === question_id ? { ...q, likes, dislikes } : q
        )
      );
    } catch (err) {
      console.error("Vote failed:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/landing");
      } else {
        toast.error("Could not cast vote. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <button onClick={handleAskQuestion} className={styles.Askbtn}>
                Ask Question
              </button>
              {/* Display welcome message with firstname, then username, then email prefix, then fallback */}
              <p className={styles.username}>
                Welcome,{" "}
                <span className="styles.username_span">
                  {userData?.firstname ||
                    userData?.username ||
                    (userData?.email ? userData.email.split("@")[0] : null) ||
                    "User"}
                </span>
                !
              </p>
            </div>
            <div className={styles.questions_sort_row}>
              <h1 className={styles.questions_list}>Questions</h1>
              <div className={styles.sort_container}>
                <label htmlFor="sort-select" className={styles.sort_label}>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  className={styles.sort_select}
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
            <form
              className={styles.search_form}
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
              }}
              role="search"
            >
              <div className={styles.search_input_wrapper}>
                <input
                  type="text"
                  className={styles.search_input}
                  placeholder="Search by tag, title, or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Search questions"
                />
                <button
                  type="submit"
                  className={styles.search_icon_btn}
                  aria-label="Search"
                >
                  <FaSearchengin size={25} className={styles.search_icon} />
                </button>
              </div>
            </form>
          </div>
          {loadingQuestions ? (
            <div className={styles.spinner_container}>
              <ClipLoader
                color={"var(--primary)"}
                loading={loadingQuestions}
                size={50}
              />
            </div>
          ) : questions.length === 0 ? (
            <p className={styles.no_questions_message}>
              No questions yet. Be the first to post a question!
            </p>
          ) : (
            <>
              {questions.map((q) => (
                <div
                  key={q.question_id}
                  className={styles.question_item_wrapper}
                >
                  <Link
                    to={`/question-detail/${q.question_id}`}
                    className={styles.link_container}
                  >
                    <div className={styles.user_container}>
                      <div className={styles.user_question}>
                        <div className={styles.usericon_and_username}>
                          <div className={styles.inner_center}>
                            <FaUserCircle
                              size={80}
                              className={styles.usericon}
                            />
                            <span>
                              {q.user_id === userData?.userid ? "You" : "@" + q.user_name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={styles.Qbox}>
                            <p className={styles.Qtitle}>{q.question_title}</p>
                            <p className={styles.timestamp_title}>
                              {getTimeDifference(q.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <FaChevronRight size={20} className={styles.chevron} />
                    </div>
                  </Link>

                  <div className={styles.vote_section}>
                    <VoteButtons
                      likes={q.likes ?? 0}
                      dislikes={q.dislikes ?? 0}
                      userVote={q.user_vote_type}
                      onVote={(action) => handleVote(q.question_id, action)}
                    />
                  </div>
                </div>
              ))}
              {/* Pagination Controls */}
              <div className={styles.pagination_container}>
                <button
                  className={styles.pagination_btn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className={styles.pagination_info}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className={styles.pagination_btn}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;
