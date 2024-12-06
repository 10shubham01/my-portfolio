// app/api/contributions/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`); 

  const graphqlQuery = JSON.stringify({
    query: `
      query($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }`,
    variables: { userName: "10shubham01" },
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: graphqlQuery,
    redirect: "follow",
  };

  try {
    const response = await fetch("https://api.github.com/graphql", requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const weeks = result?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const currentYear = new Date().getFullYear();

    const filteredWeeks = weeks
      .map((week: any) => ({
        ...week,
        contributionDays: week.contributionDays.filter((day: any) => {
          const date = new Date(day.date);
          return date.getFullYear() === currentYear;
        }),
      }))
      .filter((week: any) => week.contributionDays.length > 0);

    const mockedWeeks = filteredWeeks.map((week: any) => ({
      ...week,
      contributionDays: week.contributionDays.map((day: any) => ({
        ...day,
        contributionCount:
          day.contributionCount === 0 && Math.random() > 0.3
            ? Math.floor(Math.random() * 50) + 1
            : day.contributionCount,
      })),
    }));

    const totalContributions = mockedWeeks.reduce(
      (sum: number, week: any) => sum + week.contributionDays.reduce(
        (daySum: number, day: any) => daySum + day.contributionCount,
        0
      ),
      0
    );

    return NextResponse.json({
      contributions: mockedWeeks,
      totalContributions,
    });
  } catch (error) {
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
