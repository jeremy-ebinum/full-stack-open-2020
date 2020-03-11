import React, { useState, useLayoutEffect, useCallback } from "react";

const ToTopScroller = React.forwardRef((props, ref) => {
  const [isHidden, setIsHidden] = useState(true);
  const style = { display: isHidden ? "none" : "" };

  useLayoutEffect(() => {
    const handleScroll = () => {
      const { body, documentElement: html } = document;
      const { scrollTop } = document.documentElement;

      const pageHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const percentScrollTop = Math.round((scrollTop / pageHeight) * 100);

      if (percentScrollTop > 10) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div style={style} className="c-to-top">
      <button
        type="button"
        onClick={scrollToTop}
        className="c-btn c-btn--transparent"
      >
        Back To Top
      </button>
    </div>
  );
});

export default React.memo(ToTopScroller);
