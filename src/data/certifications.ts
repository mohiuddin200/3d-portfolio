import type { Certification } from "@/types";

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert-1",
    title: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialUrl: "https://aws.amazon.com/verification",
    credentialId: "AWS-SAA-XXXXX",
  },
  {
    id: "cert-2",
    title: "Google Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "2023",
    credentialUrl: "https://google.com/verify",
    credentialId: "GCP-PCD-XXXXX",
  },
  {
    id: "cert-3",
    title: "Meta Frontend Developer Professional",
    issuer: "Meta",
    date: "2023",
    credentialUrl: "https://coursera.org/verify",
    credentialId: "META-FE-XXXXX",
  },
  {
    id: "cert-4",
    title: "MongoDB Associate Developer",
    issuer: "MongoDB",
    date: "2022",
    credentialUrl: "https://university.mongodb.com/verify",
    credentialId: "MDB-AD-XXXXX",
  },
  {
    id: "cert-5",
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2022",
    credentialUrl: "https://tensorflow.org/verify",
    credentialId: "TF-DEV-XXXXX",
  },
  {
    id: "cert-6",
    title: "Kubernetes Application Developer",
    issuer: "CNCF",
    date: "2023",
    credentialUrl: "https://cncf.io/verify",
    credentialId: "CKAD-XXXXX",
  },
];
