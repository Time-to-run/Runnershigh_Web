import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [contents, setContent] = useState("");
  const [matching, setGender] = useState("");
  const [time, setTime] = useState("");
  const [image_url, setImage] = useState<File | null>(null);
  const [value, onChange] = useState<Date | null | [Date | null, Date | null]>(
    new Date()
  );
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  // 선택된 날짜 가져오기
  const selectedDate =
    value instanceof Date ? value.toISOString().split("T")[0] : "";

  // 게시글 생성 API 호출 함수
  const createBoard = async () => {
    const sendData = {
      title,
      contents,
      matching,
      time,
      date: selectedDate,
      image_url: "",
    };

    try {
      const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 읽기

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      // Axios POST 요청
      const response = await axios.post(
        "https://port-0-runnershigh-bakc-m46t6c3j50881cf3.sel4.cloudtype.app/board/create",
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 추가
        }
      );
      console.log("Board Created:", response.data);
      alert("게시글이 작성되었습니다!");
      navigate(-1);
    } catch (error) {
      console.error("Create Board Error:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  // 작성 완료 버튼 클릭 핸들러
  const handleSubmit = async () => {
    await createBoard();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col items-center p-4">
      {/* 헤더 */}
      <header className="p-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            게시글 작성
          </h1>
        </div>
      </header>

      {/* 본문 */}
      <main className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 mt-14">
        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-orange-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        {/* 내용 입력 */}
        <textarea
          placeholder="내용을 작성하세요"
          value={contents}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-orange-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
        ></textarea>

        {/* 매칭유형 선택 */}
        <select
          value={matching}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border border-orange-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="" disabled>
            매칭시스템 유형을 정해주세요
          </option>
          <option value="스텝업">스텝업(2:2)</option>
          <option value="러닝커넥트">러닝커넥트(4)</option>
          <option value="스텝업과 러닝커넥트">러닝메이트(1:3)</option>
        </select>

        {/* 날짜 선택 버튼 */}
        <button
          onClick={() => setModal(true)}
          className="bg-orange-500 text-white py-2 rounded-lg shadow"
        >
          날짜 선택
        </button>

        {/* 달력 모달 */}
        {modal && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[#00000030] flex items-center justify-center p-6"
            onClick={(event) => {
              event.stopPropagation();
              setModal(false);
            }}
          >
            <Calendar
              onChange={onChange}
              value={value}
              className="m-auto bg-white p-4 rounded-lg space-y-2"
            />
          </div>
        )}

        {/* 시간 선택 */}
        <div className="flex flex-col items-start mt-4">
          <label htmlFor="time-select" className="mb-2 text-lg">
            시간 선택
          </label>
          <select
            id="time-select"
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          >
            <option value="">시간을 선택하세요</option>
            {Array.from({ length: 24 }, (_, index) => (
              <option key={index} value={`${index}:00`}>
                {`${index}:00`}
              </option>
            ))}
          </select>
        </div>

        {/* 이미지 업로드 */}
        <div className="flex flex-col items-start">
          <label
            htmlFor="image-upload"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer w-full text-center"
          >
            이미지 업로드
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {image_url && (
            <img
              src={URL.createObjectURL(image_url)}
              alt="Preview"
              className="mt-4 w-full max-h-40 object-cover rounded-lg border border-orange-300"
            />
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg shadow hover:bg-orange-600 transition"
          >
            작성 완료
          </button>
          <button
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg shadow hover:bg-gray-400 transition"
            onClick={() => {
              navigate(-1);
            }}
          >
            취소
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
