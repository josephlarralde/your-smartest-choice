class EmptyState {
  constructor(experience, globalState) {
    this.experience = experience;
  }

  enter() {
    this.timeouts = [
      setTimeout(() => {
        this.experience.showCreditsPage(1);
      }, 2000),
      setTimeout(() => {
        this.experience.showCreditsPage(2);
      }, 7000),
      setTimeout(() => {
        this.experience.showCreditsPage(3);
      }, 12000),
    ]
  }

  exit() {
    this.timeouts.forEach((to) => { clearTimeout(to); });
    this.experience.showCreditsPage(0);
  }
};

export default EmptyState;
