// Define the types for the GitHub response structure
type ContributionDay = {
  date: string;
  contributionCount: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type GitHubResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
};

type MockedContributionWeek = {
  contributionDays: {
    date: string;
    contributionCount: number;
  }[];
};

type ContributionData = {
  contributions: MockedContributionWeek[];
  totalContributions: number;
};

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

    const result: GitHubResponse = await response.json();
    const weeks = result?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const currentYear = new Date().getFullYear();

    // Filter weeks to include only the current year
    const filteredWeeks: ContributionWeek[] = weeks
      .map((week) => ({
        ...week,
        contributionDays: week.contributionDays.filter((day) => {
          const date = new Date(day.date);
          return date.getFullYear() === currentYear;
        }),
      }))
      .filter((week) => week.contributionDays.length > 0);

    // Mock contributions if contributionCount is 0
    const mockedWeeks: MockedContributionWeek[] = filteredWeeks.map((week) => ({
      ...week,
      contributionDays: week.contributionDays.map((day) => ({
        ...day,
        contributionCount:
          day.contributionCount === 0 && Math.random() > 0.3
            ? Math.floor(Math.random() * 50) + 1
            : day.contributionCount,
      })),
    }));

    // Calculate total contributions
    const totalContributions = mockedWeeks.reduce(
      (sum, week) =>
        sum +
        week.contributionDays.reduce(
          (daySum, day) => daySum + day.contributionCount,
          0
        ),
      0
    );

    const contributionData: ContributionData = {
      contributions: mockedWeeks,
      totalContributions,
    };

    return NextResponse.json(contributionData);
  } catch {
    // You can log the error or handle it as needed
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
