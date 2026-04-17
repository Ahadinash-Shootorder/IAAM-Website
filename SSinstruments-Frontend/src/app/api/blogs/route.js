let blogs = [
  {
    id: "1",
    slug: "how-to-choose-the-right-instrument",
    title: "How to Choose the Right Instrument for Your Needs",
    excerpt:
      "A comprehensive guide to selecting the perfect instrument based on your requirements and skill level.",
    content: `Choosing the right instrument can be a daunting task, especially if you're new to the field. Whether you're looking for laboratory equipment, musical instruments, or audio gear, there are several factors to consider.

First, identify your specific needs. What will you be using the instrument for? Are you a beginner or an experienced professional? What's your budget?

Next, research the different options available. Read reviews, compare specifications, and talk to experts in the field. Many manufacturers offer trial periods or demos, which can be invaluable in making your decision.

Finally, consider the long-term value. While price is important, investing in a quality instrument that will last years can actually save you money in the long run.`,
    author: "John Smith",
    authorImage : "/blog-author.svg",
    date: "2024-01-15",
    category: "Tips & Guides",
    image: "/blogImage.jpg",
  },
  {
    id: "2",
    slug: "latest-innovations-in-laboratory-equipment",
    title: "Latest Innovations in Laboratory Equipment",
    excerpt:
      "Discover the cutting-edge technologies revolutionizing laboratory work and scientific research.",
    content: `The field of laboratory equipment has seen remarkable advancements in recent years. New technologies are making research faster, more accurate, and more efficient than ever before.

One of the most significant innovations is the integration of artificial intelligence and machine learning into laboratory instruments. These technologies can now analyze data in real-time and provide insights that would have taken hours to compile manually.

Automation is another major trend. Modern laboratory equipment can perform complex tasks with minimal human intervention, increasing productivity and reducing the risk of human error.

Additionally, many instruments now feature connectivity options, allowing researchers to access data from anywhere in the world. This has revolutionized collaboration and remote work in scientific fields.`,
    author: "Dr. Sarah Johnson",
    authorImage : "/blog-author.svg",
    date: "2024-01-10",
    category: "Technology",
    image: "/blogImage.jpg",
  },
  {
    id: "3",
    slug: "maintenance-tips-for-your-instruments",
    title: "Essential Maintenance Tips for Your Instruments",
    excerpt:
      "Keep your instruments in top condition with these practical maintenance tips and best practices.",
    content: `Proper maintenance is crucial for ensuring your instruments remain accurate, reliable, and long-lasting. Here are some essential tips to keep your equipment in top condition.

Regular Cleaning: Clean your instruments regularly according to the manufacturer's guidelines. Use appropriate cleaning materials to avoid damage.

Calibration: Many instruments require regular calibration to maintain accuracy. Create a maintenance schedule and stick to it.

Storage: Store your instruments in a safe, clean environment. Protect them from dust, moisture, and temperature fluctuations.

Professional Service: Don't hesitate to seek professional maintenance services when needed. Many manufacturers offer service programs.

Documentation: Keep detailed records of maintenance activities, repairs, and calibrations. This helps track the instrument's history and identify patterns.

Training: Ensure that all users are properly trained in using and maintaining the equipment. Proper handling can prevent many issues.`,
    author: "Michael Chen",
    authorImage : "/blog-author.svg",
    date: "2024-01-05",
    category: "Maintenance",
    image: "/blogImage.jpg",
  }
];

export async function GET() {
  return Response.json(blogs);
}

export async function POST(request) {
  const body = await request.json();
  const newBlog = {
    ...body,
    id: Date.now().toString(),
    slug: body.title.toLowerCase().replace(/\s+/g, "-"),
    date: new Date().toISOString().split("T")[0],
  };
  blogs.push(newBlog);
  return Response.json(newBlog, { status: 201 });
}
