// Helper to smoothly scroll to form section on Mobile & Desktop
export function scrollToForm(formId: string = "consultation"): boolean {
  if (typeof window !== "undefined") {
    const targetElement = 
      document.getElementById(formId) || 
      document.getElementById("test-drive-form") ||
      document.getElementById("booking-banner") ||
      document.querySelector("form");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }
  return false;
}

// Handler for mobile CTA clicks that should direct to form
export function handleCtaFormClick(
  e?: React.MouseEvent,
  onMobileScrollTarget: string = "consultation",
  fallbackNavigate?: () => void
) {
  if (e) e.preventDefault();
  
  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;
    
    // On mobile, prioritize scrolling to form directly on the current page if available
    if (isMobile) {
      const scrolled = scrollToForm(onMobileScrollTarget);
      if (scrolled) return;
    }
  }

  if (fallbackNavigate) {
    fallbackNavigate();
  } else {
    scrollToForm(onMobileScrollTarget);
  }
}
