import { Helmet } from "react-helmet-async";

document.title = "About Holidaze";

function About() {
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Learn more about Holidaze – your trusted platform for booking incredible stays and experiences."
                />
                <meta
                    name="keywords"
                    content="about, Holidaze, who we are, mission, travel platform, vacation, booking"
                />
                <meta name="author" content="JNettli" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta property="og:title" content="About Holidaze" />
                <meta
                    property="og:description"
                    content="We're committed to making your travel dreams a reality. Read about our mission and what drives us."
                />
                <meta
                    property="og:image"
                    content="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500"
                />
            </Helmet>
            <div className="max-w-5xl flex mx-auto px-4 pt-8">
                <div className="mx-8 bg-white rounded-xl shadow-lg px-16 py-4">
                    <h1 className="text-4xl font-bold text-center mb-6 text-[#088D9A]">
                        About Holidaze
                    </h1>
                    <p className="text-lg text-gray-700 mb-4 text-center">
                        Holidaze is your go-to platform for discovering,
                        booking, and managing unique accommodations around the
                        world. Whether you're looking for a cozy mountain cabin,
                        a beachfront villa, or a city-center apartment, we've
                        got something for every type of traveler.
                    </p>

                    <div className="mx-auto w-fit">
                        <h2 className="text-2xl font-semibold text-[#088D9A] mt-10 mb-2">
                            Why Choose Holidaze?
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>
                                🌍 Explore a wide variety of destinations and
                                properties globally.
                            </li>
                            <li>
                                📅 Easy-to-use calendar booking with real-time
                                availability.
                            </li>
                            <li>
                                🔐 Secure and reliable booking backed by
                                verified hosts.
                            </li>
                            <li>
                                👥 Host and guest support to ensure smooth
                                communication.
                            </li>
                            <li>💡 Transparent pricing with no hidden fees.</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-semibold text-[#088D9A] mt-10 mb-2">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 mb-4">
                        At Holidaze, our mission is to connect people with
                        unforgettable stays — helping travelers find their
                        perfect match while empowering hosts to showcase their
                        spaces with confidence.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#088D9A] mt-10 mb-2">
                        Join the Community
                    </h2>
                    <p className="text-gray-700">
                        Become part of our growing community of adventurers and
                        hosts. Whether you're planning your next escape or
                        opening your doors to the world, Holidaze is here to
                        make every stay memorable.
                    </p>
                </div>
            </div>
        </>
    );
}

export default About;
