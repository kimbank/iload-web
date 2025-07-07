'use client';

import React, { useState } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area} from 'recharts';
import { ChevronDown } from 'lucide-react';
import Divider from "@/components/divider";

interface DropdownQuestionProps {
  text: string;
  answer: string;
}

const DropdownQuestion = ({ text, answer }: DropdownQuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-1 border-gray-200 overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800 leading-relaxed">{text}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
          <div className="pt-3">
            <p className="leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface CountryData {
  flag: string;
  name: string;
  subtitle: string;
  data: Array<{ month: string; value: number }>;
  annotation?: {
    date: string;
    price: string;
  };
}

interface CountryDetailCardProps {
  country: CountryData;
}

const CountryDetailCard = ({ country }: CountryDetailCardProps) => {
  return (
    <div className="last:border-b-0">
      {/* Country Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{country.flag}</span>
        <div>
          <h3 className="text-lg font-semibold">{country.name}</h3>
          <p className="text-sm text-gray-600">{country.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="relative border-1 border-gray-200 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%" aspect={1.5}>
            <AreaChart data={country.data} margin={{ top: 30, right: 30, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id={`gradient-${country.name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                domain={[0, 500]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000000"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill={`url(#gradient-${country.name})`}
                dot={{ r: 4, stroke: '#000000', strokeWidth: 6, strokeOpacity: "50%", fill: '#000000', strokeDasharray:'' }}
                activeDot={{ r: 4, stroke: '#000000', strokeWidth: 7, strokeOpacity: "0%", fill: '#000000' }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Annotation */}
          {country.annotation && (
            <div className="absolute top-8 left-1/3 bg-white border border-gray-300 px-3 py-2 rounded-lg shadow-sm text-xs">
              <div className="text-gray-500">{country.annotation.date}</div>
              <div className="font-semibold text-gray-800">{country.annotation.price}</div>
            </div>
          )}
        </div>

        {/* Dropdown Questions */}
        <div className="space-y-4">
          <DropdownQuestion 
            text="해당 국가의 최고가 형성 배경이 궁금해요" 
            answer={`${country.name}에서의 최고가는 여러 요인에 의해 형성됩니다. 주요 요인으로는 현지 경제 상황, 관세 정책, 운송비, 그리고 현지 수요와 공급 상황이 있습니다.`}
          />
          <DropdownQuestion 
            text="해당 국가의 최저가 형성 배경이 궁금해요" 
            answer={`${country.name}에서의 최저가는 계절적 요인, 유가 변동, 정치적 안정성, 그리고 환율 변동 등의 영향을 받아 형성됩니다.`}
          />
          <DropdownQuestion 
            text="해당 국가에서 중요하게 보는 차량 특징이 궁금해요" 
            answer={`${country.name} 시장에서는 연비, 내구성, 브랜드 인지도, 그리고 현지 기후에 적합한 기능들이 중요하게 평가됩니다.`}
          />
        </div>
      </div>

      <Divider className="my-14 -mx-6" />
    </div>
  );
};

export default CountryDetailCard;
