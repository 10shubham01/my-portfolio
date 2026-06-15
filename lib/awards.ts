import awardsJson from "@/data/awards.json"

export interface Award {
  title: string
  year: string
  organization: string
  description: string
}

export const AWARDS: Award[] = awardsJson.awards
