import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Article bodies for src/app/data/insights.ts, by slug and language. Plain prose: h2, p, ul/ol, links.
 * Facts only — no legal advice, no invented numbers.
 */
export const insightBodies: Record<string, { en?: ReactNode; az?: ReactNode }> = {
  "when-spreadsheets-stop-working": {
    en: (
      <>
        <p>
          Most risk and compliance programmes start in spreadsheets, and that is a sensible start: everyone has the tool, and a
          first risk register or control list does not need more. The trouble starts later, when the same work has to be repeated
          every quarter, shared across teams and shown to an auditor.
        </p>
        <h2>Five signs you have outgrown spreadsheets</h2>
        <ol>
          <li>
            <strong>The same risk lives in several files.</strong> Each department keeps its own copy, and nobody is sure which one is
            current.
          </li>
          <li>
            <strong>Links are kept by hand.</strong> A risk points to a control, the control to a policy and to evidence. In a
            spreadsheet those links are cell references and comments, and they break when a row moves.
          </li>
          <li>
            <strong>Audit preparation means collecting.</strong> Weeks go into finding the latest version of a policy, screenshots and
            email approvals, instead of checking whether controls work.
          </li>
          <li>
            <strong>Nobody knows what expires when.</strong> Vendor contracts, risk exceptions and review dates sit in columns that no
            one is reminded about.
          </li>
          <li>
            <strong>Access is all or nothing.</strong> A file is shared with a whole team, so either everyone can change everything, or
            the people who should update a record cannot.
          </li>
        </ol>
        <h2>What to move first</h2>
        <ul>
          <li>
            <strong>The risk register and the asset list, with owners.</strong> These are the records everything else points to.
          </li>
          <li>
            <strong>Controls, linked to the risks they treat.</strong> Once the links live in the tool, you stop maintaining them by hand.
          </li>
          <li>
            <strong>Then the frameworks you are audited against</strong>, as requirements linked to those controls. The gaps become
            visible per requirement.
          </li>
          <li>
            <strong>Keep your spreadsheets as the source for the first import.</strong> Clean them once, import them from CSV, and stop
            editing them afterwards.
          </li>
        </ul>
        <h2>Questions to ask any GRC tool</h2>
        <ul>
          <li>Can it run in your own data centre, if your data has to stay in the country or inside your network?</li>
          <li>Is the interface available in the language your team works in?</li>
          <li>Can you import your current registers from CSV, and export them again?</li>
          <li>Can permissions be set per module and per action, and is every change written to a log an auditor can read?</li>
          <li>Can you build your own framework package, for a local law or an internal standard, not only the ones it ships with?</li>
        </ul>
        <h2>Where GRC360 fits</h2>
        <p>
          We built <Link to="/products/grc360">GRC360</Link> for this step: twelve connected modules in Azerbaijani and English, in our
          cloud or on your own servers, with CSV import for the registers you keep today. If you are planning the move,{" "}
          <Link to="/contact?topic=Product%20inquiry">tell us about your programme</Link>.
        </p>
      </>
    ),
    az: (
      <>
        <p>
          Risk və uyğunluq proqramlarının çoxu Excel cədvəllərindən başlayır və bu, ağıllı başlanğıcdır: alət hamıda var, ilk risk
          reyestri və ya nəzarət tədbirləri siyahısı üçün artığı lazım deyil. Çətinlik sonra başlayır: eyni işi hər rüb təkrarlamaq,
          komandalar arasında bölüşmək və auditora göstərmək lazım gələndə.
        </p>
        <h2>Cədvəllərdən böyüdüyünüzü göstərən beş əlamət</h2>
        <ol>
          <li>
            <strong>Eyni risk bir neçə faylda yaşayır.</strong> Hər departament öz nüsxəsini saxlayır və hansının aktual olduğunu
            heç kim dəqiq bilmir.
          </li>
          <li>
            <strong>Əlaqələr əl ilə saxlanılır.</strong> Risk nəzarət tədbirinə, nəzarət tədbiri siyasətə və sübuta işarə edir.
            Cədvəldə bu əlaqələr xana istinadları və şərhlərdir, sətir yerini dəyişəndə qırılır.
          </li>
          <li>
            <strong>Auditə hazırlıq toplamaqdan ibarətdir.</strong> Həftələr nəzarət tədbirlərinin işləyib-işləmədiyini yoxlamağa
            yox, siyasətin son versiyasını, ekran görüntülərini və e-poçtla verilmiş təsdiqləri tapmağa gedir.
          </li>
          <li>
            <strong>Nəyin nə vaxt bitdiyini heç kim bilmir.</strong> Təchizatçı müqavilələri, risk istisnaları və baxış tarixləri
            heç kimə xatırladılmayan sütunlarda qalır.
          </li>
          <li>
            <strong>Giriş ya hamıya, ya heç kimə.</strong> Fayl bütöv komanda ilə bölüşülür: ya hər kəs hər şeyi dəyişə bilir, ya da
            qeydi yeniləməli olan şəxs bunu edə bilmir.
          </li>
        </ol>
        <h2>İlk nəyi köçürmək lazımdır</h2>
        <ul>
          <li>
            <strong>Risk reyestri və aktivlər siyahısı, məsul şəxslərlə.</strong> Qalan hər şey bu qeydlərə işarə edir.
          </li>
          <li>
            <strong>Müalicə etdikləri risklərə bağlanmış nəzarət tədbirləri.</strong> Əlaqələr alətin içində yaşayanda onları əl ilə
            saxlamağa ehtiyac qalmır.
          </li>
          <li>
            <strong>Sonra audit olunduğunuz framework-lər</strong>, həmin nəzarət tədbirlərinə bağlanmış tələblər kimi. Boşluqlar hər
            tələb üzrə görünür olur.
          </li>
          <li>
            <strong>Cədvəllərinizi ilk idxal üçün mənbə kimi saxlayın.</strong> Onları bir dəfə təmizləyin, CSV ilə idxal edin və
            bundan sonra cədvəldə redaktə etməyin.
          </li>
        </ul>
        <h2>İstənilən GRC alətinə veriləcək suallar</h2>
        <ul>
          <li>Məlumatınız ölkədə və ya şəbəkənizin içində qalmalıdırsa, alət öz məlumat mərkəzinizdə işləyə bilirmi?</li>
          <li>İnterfeys komandanızın işlədiyi dildə varmı?</li>
          <li>Mövcud reyestrlərinizi CSV-dən idxal və yenidən ixrac etmək olurmu?</li>
          <li>İcazələr hər modul və hər əməliyyat üzrə qurulurmu, hər dəyişiklik auditorun oxuya biləcəyi jurnala yazılırmı?</li>
          <li>Yalnız hazır gələnləri yox, yerli qanun və ya daxili standart üçün öz framework paketinizi qura bilirsinizmi?</li>
        </ul>
        <h2>GRC360 burada harada dayanır</h2>
        <p>
          <Link to="/az/products/grc360">GRC360</Link>-ı məhz bu addım üçün qurmuşuq: Azərbaycan və ingilis dilində on iki
          bir-birinə bağlı modul, bizim buludda və ya öz serverlərinizdə, bu gün saxladığınız reyestrlər üçün CSV idxalı ilə. Keçidi
          planlaşdırırsınızsa, <Link to="/az/contact?topic=Product%20inquiry">proqramınız barədə bizə yazın</Link>.
        </p>
      </>
    ),
  },
};
