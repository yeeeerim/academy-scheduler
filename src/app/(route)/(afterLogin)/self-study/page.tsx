"use client";

import React from "react";
import useSWR from "swr";

const page = () => {
  const { data, error, isLoading } = useSWR("/api/getSelfStudyData", () =>
    fetch(`/api/getSelfStudyData`).then(async (res) => {
      return await res.json();
    })
  );
  return (
    <div>
      <div>과목 : {data?.subject}</div>
      <div>레벨 : {data?.level}</div>
      <div>선생님 : {data?.teacher_name}</div>
      <div>
        {data?.study_data.map((v, index) => {
          return (
            <div key={index} className="flex gap-2">
              <div>{v.name}</div>
              <div>
                진도 : {v.progress.completed} / {v.progress.total}
              </div>
              <div>
                오답 : {v.wrongAnswers.completed} / {v.wrongAnswers.total}
              </div>
              <div>{v.wrongAnswerNotes}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
