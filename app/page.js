// app/page.js
"use client";

import { useState } from "react";

export default function WeatherApp() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 日本の主要都市リスト
  const cities = [
    { id: "tokyo", name: "東京", en: "Tokyo" },
    { id: "osaka", name: "大阪", en: "Osaka" },
    { id: "yokohama", name: "横浜", en: "Yokohama" },
    { id: "nagoya", name: "名古屋", en: "Nagoya" },
    { id: "sapporo", name: "札幌", en: "Sapporo" },
    { id: "fukuoka", name: "福岡", en: "Fukuoka" },
    { id: "kyoto", name: "京都", en: "Kyoto" },
    { id: "kobe", name: "神戸", en: "Kobe" },
    { id: "sendai", name: "仙台", en: "Sendai" },
    { id: "hiroshima", name: "広島", en: "Hiroshima" },
    { id: "okinawa", name: "沖縄", en: "Okinawa" },
  ];

  // OpenWeatherMap APIを使用して天気情報を取得
  const fetchWeather = async () => {
    if (!selectedCity) return;

    setLoading(true);
    setError(null);

    // 選択された都市の英語名を取得
    const selectedCityObj = cities.find((city) => city.id === selectedCity);
    if (!selectedCityObj) {
      setError("都市が見つかりません");
      setLoading(false);
      return;
    }

    const cityNameEn = selectedCityObj.en;

    // 簡単なデモのためのモックデータ（APIキーが無効な場合のフォールバック）
    try {
      // 実際のAPIコールは以下のようになります:
      // OpenWeatherMap APIのキー
      // const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_API_KEY';
      // const res = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?q=${cityNameEn}&appid=${API_KEY}&units=metric&lang=ja`
      // );
      // if (!res.ok) {
      //   throw new Error(`APIエラー: ${res.status}`);
      // }
      // const data = await res.json();

      // モックデータを使用
      await new Promise((resolve) => setTimeout(resolve, 800)); // APIリクエストの遅延をシミュレート

      // ランダムな天気データを生成
      const weatherTypes = [
        { id: 800, description: "快晴" },
        { id: 801, description: "晴れ" },
        { id: 802, description: "曇り" },
        { id: 500, description: "小雨" },
        { id: 501, description: "雨" },
        { id: 600, description: "雪" },
        { id: 741, description: "霧" },
      ];

      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

      const mockData = {
        city: selectedCityObj.name,
        temperature: Math.floor(Math.random() * 35) - 5, // -5℃〜30℃
        weatherType: randomWeather.description,
        weatherId: randomWeather.id,
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 20),
        date: new Date().toLocaleDateString(),
      };

      setWeather(mockData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("天気情報の取得に失敗しました。後でもう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // 天気コードに基づいたアイコンと背景色を取得
  const getWeatherIcon = (weatherId) => {
    // OpenWeatherMap APIの天気コードに基づいてアイコンを返す
    // https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) return "⚡"; // 雷雨
    if (weatherId >= 300 && weatherId < 400) return "🌧️"; // 霧雨
    if (weatherId >= 500 && weatherId < 600) return "🌧️"; // 雨
    if (weatherId >= 600 && weatherId < 700) return "❄️"; // 雪
    if (weatherId >= 700 && weatherId < 800) return "🌫️"; // 霧/もや
    if (weatherId === 800) return "☀️"; // 晴れ
    if (weatherId > 800) return "☁️"; // 曇り
    return "🌈"; // その他
  };

  const getBackgroundColor = (weatherId) => {
    // 天気コードに基づいて背景色を返す
    if (weatherId >= 200 && weatherId < 300) return "bg-purple-100"; // 雷雨
    if (weatherId >= 300 && weatherId < 400) return "bg-blue-100"; // 霧雨
    if (weatherId >= 500 && weatherId < 600) return "bg-blue-200"; // 雨
    if (weatherId >= 600 && weatherId < 700) return "bg-blue-50"; // 雪
    if (weatherId >= 700 && weatherId < 800) return "bg-gray-200"; // 霧/もや
    if (weatherId === 800) return "bg-yellow-100"; // 晴れ
    if (weatherId > 800) return "bg-gray-100"; // 曇り
    return "bg-indigo-100"; // その他
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">天気予報アプリ</h1>

        {/* 都市選択 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">都市を選択</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setWeather(null); // 都市を変更したら天気情報をリセット
                }}
                className={`p-2 text-sm rounded-lg transition-colors ${selectedCity === city.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <button onClick={fetchWeather} disabled={loading || !selectedCity} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {loading ? "読込中..." : "天気を取得"}
            </button>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {/* 天気情報 */}
        {weather && (
          <div className={`rounded-lg p-6 ${getBackgroundColor(weather.weatherId)}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{weather.city}</h2>
              <p className="text-sm text-gray-600">{weather.date}</p>
            </div>

            <div className="flex items-center justify-center my-6">
              <span className="text-6xl mr-4">{getWeatherIcon(weather.weatherId)}</span>
              <div>
                <p className="text-5xl font-bold">{weather.temperature}°C</p>
                <p className="text-xl">{weather.weatherType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-500">湿度</p>
                <p className="text-xl font-semibold">{weather.humidity}%</p>
              </div>
              <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-500">風速</p>
                <p className="text-xl font-semibold">{weather.windSpeed} m/s</p>
              </div>
            </div>
          </div>
        )}

        {/* 初期状態のガイド */}
        {!weather && !loading && !error && selectedCity && (
          <div className="text-center text-gray-500 mt-8">
            <p>「天気を取得」ボタンをクリックして天気情報を表示します。</p>
          </div>
        )}

        {/* 使い方ガイド */}
        {!selectedCity && !loading && !error && (
          <div className="text-center text-gray-500 mt-8">
            <p>上の都市から一つ選択してください。</p>
          </div>
        )}
      </div>
    </div>
  );
}
