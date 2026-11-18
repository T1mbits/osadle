import { styleForImage } from "../lib/utils";
import "./credits.css";

function PersonCard({
    iconUrl,
    name,
    contribution,
    socials,
}: {
    iconUrl: string;
    name: string;
    contribution: string;
    socials: {
        name: string;
        url: string;
    }[];
}) {
    return (
        <div className="card">
            <span className="personIcon" style={styleForImage(iconUrl)} />
            <div className="right">
                <span className="name">{name}</span>
                <span className="contribution disabled">{contribution}</span>
                <div className="socials">
                    {socials.map((v) => {
                        return (
                            <button
                                type="button"
                                key={v.name}
                                onClick={() => {
                                    window.open(v.url, "_blank");
                                }}
                            >
                                {v.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function Credits() {
    return (
        <>
            <div className="bg">
                <span id="osage" />
            </div>
            <div className="content">
                <a href="#home">back?</a>
                <span id="logo" />
                <h2>credits</h2>
                <div>
                    <PersonCard
                        name="inabakumori"
                        contribution="peak"
                        iconUrl="/images/credits/inabakumori.png"
                        socials={[
                            {
                                name: "X/Twitter",
                                url: "https://x.com/inabakumori/",
                            },
                        ]}
                    />
                    <PersonCard
                        name="nknk"
                        contribution="made osage"
                        iconUrl="/images/credits/nknk.png"
                        socials={[
                            {
                                name: "X/Twitter",
                                url: "https://x.com/NKNK_NGRMS/",
                            },
                        ]}
                    />
                    <PersonCard
                        name="windy (the worse one)"
                        contribution="osadle.guhw.dev"
                        iconUrl="https://guhw.dev/about/assets/images/pfp.png"
                        socials={[
                            {
                                name: "X/Twitter",
                                url: "https://x.com/amewindyy",
                            },
                        ]}
                    />
                </div>
                <span className="loadingFish" />
            </div>
        </>
    );
}
