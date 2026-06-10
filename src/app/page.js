import Banner from "@/components/homepage/Banner";
import CTA from "@/components/homepage/CTA";
import FeaturedProjects from "@/components/homepage/FeaturedJobs";
import JobFeatures from "@/components/homepage/JobFeatures";
import Pricing from "@/components/homepage/Pricing";

export default function Home() {
  return (
   <>
   <Banner />
   <FeaturedProjects />
   <JobFeatures />
   <Pricing />
   <CTA />
   </>
  );
}
