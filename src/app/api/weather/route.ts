import { NextResponse } from "next/server";

export const revalidate = 1800;

const KC_LAT = 38.9717;
const KC_LNG = -94.6672;

export async function GET() {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.searchParams.set("latitude", KC_LAT.toString());
    url.searchParams.set("longitude", KC_LNG.toString());
    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,precipitation,weather_code"
    );
    url.searchParams.set("hourly", "soil_temperature_6cm");
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
    );
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("precipitation_unit", "inch");
    url.searchParams.set("timezone", "America/Chicago");
    url.searchParams.set("forecast_days", "7");

    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo error: ${res.status}`);
    }

    const data = await res.json();

    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    const currentHourIndex = new Date().getHours();
    const soilTemp = Math.round(
      hourly.soil_temperature_6cm[currentHourIndex] ??
        hourly.soil_temperature_6cm[0]
    );

    const forecast = daily.time.slice(0, 5).map((date: string, i: number) => ({
      date,
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      precipitation: daily.precipitation_sum[i],
      weatherCode: daily.weather_code[i],
    }));

    let soilTempStatus:
      | "dormant"
      | "pre-emergent"
      | "closing"
      | "summer"
      | "overseeding";

    if (soilTemp < 50) {
      soilTempStatus = "dormant";
    } else if (soilTemp >= 50 && soilTemp < 55) {
      soilTempStatus = "pre-emergent";
    } else if (soilTemp >= 55 && soilTemp < 65) {
      soilTempStatus = "closing";
    } else if (soilTemp >= 65 && soilTemp < 70) {
      soilTempStatus = "overseeding";
    } else {
      soilTempStatus = "summer";
    }

    const soilTempAlerts: Record<string, string> = {
      dormant: "Soil dormant below 50F -- no action needed",
      "pre-emergent":
        `Pre-emergent window OPEN -- soil at ${soilTemp}F. Apply now.`,
      closing:
        `Pre-emergent window CLOSING -- soil at ${soilTemp}F. Act fast.`,
      overseeding:
        `Overseeding conditions IDEAL -- soil at ${soilTemp}F.`,
      summer:
        `Summer stress mode -- soil at ${soilTemp}F. Mow high, water deep.`,
    };

    return NextResponse.json({
      current: {
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
      },
      soilTemp,
      soilTempStatus,
      soilTempAlert: soilTempAlerts[soilTempStatus],
      forecast,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Weather API error:", err);

    return NextResponse.json(
      {
        error: true,
        current: null,
        soilTemp: null,
        soilTempStatus: null,
        soilTempAlert: null,
        forecast: [],
        lastUpdated: null,
      },
      { status: 200 }
    );
  }
}
