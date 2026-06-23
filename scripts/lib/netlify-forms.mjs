export function renderOriginContactForm(data) {
  const f = data.contact.form;
  const grades = f.grades.map((g) => `<option>${g}</option>`).join('');
  const formNote = data.contact.formNote || '';
  return `<form name="contact" class="form reveal" data-contact-form method="POST" data-netlify="true" netlify-honeypot="bot-field" style="transition-delay:.1s">
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="field-row">
          <div class="field">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" />
          </div>
          <div class="field">
            <label>${f.gradeLabel}</label>
            <select name="grade">${grades}</select>
          </div>
        </div>
        <div class="field">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" />
        </div>
        <div class="field">
          <label>${f.universitiesLabel}</label>
          <input type="text" name="universities" placeholder="${f.universitiesPlaceholder}" />
        </div>
        <div class="field">
          <label>${f.messageLabel}</label>
          <textarea name="message" placeholder="${f.messagePlaceholder}"></textarea>
        </div>
        <button type="submit" class="btn btn-navy form-submit">${f.submit}</button>
        <p class="form-note">${formNote}</p>
      </form>`;
}

export function renderStudyKoreaContactForm(data) {
  const f = data.contact.form;
  const goals = f.goals.map((g) => `<option>${g}</option>`).join('');
  const levels = f.koreanLevels.map((l) => `<option>${l}</option>`).join('');
  const formNote = data.contact.formNote || '';
  return `<form name="study-korea" class="form reveal" data-study-korea-form method="POST" data-netlify="true" netlify-honeypot="bot-field" style="transition-delay:.1s">
        <input type="hidden" name="form-name" value="study-korea" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="field-row">
          <div class="field">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" required />
          </div>
          <div class="field">
            <label>${f.countryLabel}</label>
            <input type="text" name="country" placeholder="${f.countryPlaceholder}" />
          </div>
        </div>
        <div class="field">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" required />
        </div>
        <div class="field-row">
          <div class="field">
            <label>${f.goalLabel}</label>
            <select name="goal">
              <option value="">${f.goalPlaceholder}</option>
              ${goals}
            </select>
          </div>
          <div class="field">
            <label>${f.koreanLevelLabel}</label>
            <select name="korean_level">
              <option value="">${f.koreanLevelPlaceholder}</option>
              ${levels}
            </select>
          </div>
        </div>
        <div class="field">
          <label>${f.universitiesLabel}</label>
          <input type="text" name="universities" placeholder="${f.universitiesPlaceholder}" />
        </div>
        <div class="field">
          <label>${f.messageLabel}</label>
          <textarea name="message" placeholder="${f.messagePlaceholder}"></textarea>
        </div>
        <button type="submit" class="btn btn-navy form-submit">${f.submit}</button>
        <p class="form-note">${formNote}</p>
      </form>`;
}
