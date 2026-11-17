import "./error.css";

export default function ErrorPage() {
    return (
        <>
            <div className="bg">
                <span id="osage" />
            </div>
            <div id="msg">
                <h1>not found</h1>
                <p>
                    this page you were looking for does not exist.
                    <br />
                    <span className="disabled">
                        not even osage can find it. see !! look !!
                    </span>
                </p>
                <br />
                <a href="#home">go back?</a>
            </div>
        </>
    );
}
