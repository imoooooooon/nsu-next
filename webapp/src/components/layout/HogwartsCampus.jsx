import { useId } from 'react';

/* Original vector study: the Great Hall, conical towers and stone viaduct
   above a lakeside cliff. Inherits the auth illustration colour in both themes. */
export function HogwartsCampus() {
  const id = useId();
  const windowId = `${id}-window`;
  const towerId = `${id}-tower`;
  return (
    <svg className="auth-campus" viewBox="0 0 1200 540" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <defs>
        <g id={windowId}>
          <path d="M0 22V8Q0 2 5 0Q10 2 10 8V22Z M5 3V22 M1 12H9" />
        </g>
        <g id={towerId}>
          <path d="M-18 0H18V116H-18Z M-23 0L0-64L23 0Z M0-74V-64 M-21-5H21 M-20 8H20 M-18 92H18 M0-60L-10-3 M0-60L10-3" />
          <use href={`#${windowId}`} x="-5" y="25" />
          <use href={`#${windowId}`} x="-5" y="65" />
          <path d="M-18 110H18 M-18 106H18" />
        </g>
      </defs>
      {/* Distant hills and the quiet lake horizon. */}
      <g opacity=".32" strokeWidth="1">
        <path d="M0 300L75 259L124 279L201 212L251 236L320 182L385 224L439 197L509 229 M875 252L935 206L985 235L1044 191L1115 244L1200 208" />
        <path d="M0 327Q140 311 230 330 M988 322Q1110 303 1200 316 M0 438H137 M1049 438H1200" />
        <path d="M312 481H456 M627 498H771 M907 476H1045 M484 520H646 M173 496H276 M1000 517H1116" />
      </g>
      {/* Rear turrets and connecting wings. */}
      <g opacity=".55">
        <use href={`#${towerId}`} transform="translate(345 212) scale(.74)" />
        <use href={`#${towerId}`} transform="translate(505 166) scale(.85)" />
        <use href={`#${towerId}`} transform="translate(732 189) scale(.7)" />
        <path d="M305 304V252L385 226L449 251V306 M320 250L385 216L437 241 M348 273H414V304 M391 233V252" />
        <path d="M669 306V249L715 222L783 243V312 M690 245L716 212L758 232 M755 250V307" />
        {[325, 355, 385, 415, 690, 725, 762].map(x => <use key={x} href={`#${windowId}`} x={x} y="265" />)}
      </g>
      {/* Astronomy tower: tall tapered roof, circular stone drum, buttresses. */}
      <g>
        <path d="M552 157L597 34L642 157Z M597 17V34 M587 33H607 M552 157Q597 172 642 157 M559 165V323 M635 165V323 M565 174Q596 184 629 174 M558 193Q598 206 636 193 M558 274Q598 287 636 274 M558 312Q598 325 636 312" />
        <path d="M597 39L571 158 M597 39L584 163 M597 39L611 163 M597 39L625 158 M551 146H643 M563 322V350 M631 322V350" />
        {[570, 592, 614].map(x => <g key={x}><use href={`#${windowId}`} x={x} y="215" /><use href={`#${windowId}`} x={x} y="285" /></g>)}
        <path d="M551 255L543 271V338H558 M643 255L651 271V338H636 M574 181V190 M596 186V196 M618 181V190" />
      </g>
      {/* Great Hall and its steep slate roof, lancets and entrance. */}
      <g>
        <path d="M290 331V278L383 209L542 275V357 M290 278H542 M289 278L383 198L550 268 M383 209V278 M383 198V180 M378 186H388 M296 288H535 M296 337H535" />
        <path d="M305 278L383 220L521 278 M321 278L383 230L502 278 M336 278L383 240L481 278 M352 278L383 250L461 278 M369 278L383 261L438 278" opacity=".5" />
        {[310, 345, 390, 424, 458, 492, 525].map(x => <use key={x} href={`#${windowId}`} x={x} y="300" transform={`translate(${-x * .25} -75) scale(1.25)`} />)}
        <path d="M365 356V319Q365 300 383 292Q400 300 400 319V357 M382 301V356 M371 320H395 M308 291V336 M339 291V342 M415 291V348 M449 291V351 M483 291V354 M517 291V356" />
      </g>
      {/* Clock courtyard, gables and a pair of flanking spires. */}
      <g>
        <path d="M655 358V266L697 220L740 266V372 M649 266L697 210L747 266 M666 260H730 M667 273H729 M665 331H731 M697 221V236" />
        <circle cx="697" cy="291" r="18" /><circle cx="697" cy="291" r="14" />
        <path d="M697 278V281 M697 301V304 M684 291H687 M707 291H710 M697 281V291L706 297 M682 358V338Q697 314 712 338V363" />
        <use href={`#${towerId}`} transform="translate(778 249) scale(.78)" />
        <use href={`#${towerId}`} transform="translate(874 287) scale(.62)" />
        <path d="M748 364V307L824 274L883 309V384 M766 304L824 263L867 297 M824 274V312 M749 315H881 M752 356H880" />
        {[759, 790, 824, 854].map(x => <use key={x} href={`#${windowId}`} x={x} y="328" />)}
      </g>
      {/* Foreground tower, ramparts and terrace. */}
      <g>
        <use href={`#${towerId}`} transform="translate(255 241) scale(1.15)" />
        <path d="M223 351V333H232V340H241V333H250V340H260V333H270V340H280V333H291V352 M228 351L481 375L666 381L902 405 M228 363L481 389L666 395L902 419" />
        <path d="M457 373V351H467V358H477V351H487V358H497V351H507V375 M632 379V359H642V366H652V359H662V366H672V359H682V383" />
        <path d="M477 384V404 M654 393V415 M898 411V428" />
      </g>
      {/* Stone viaduct with recessed arches over the ravine. */}
      <g>
        <path d="M70 337L228 348V362L70 352Z M76 351V420 M225 361V405 M87 416V380Q100 355 113 382V423 M128 426V384Q142 359 155 386V424 M171 418V387Q185 364 200 390V410 M76 365L218 375" />
        <path d="M74 338V329 M94 340V331 M114 341V332 M134 343V334 M154 344V335 M174 346V337 M194 347V338 M214 348V339" />
      </g>
      {/* Cliff strata and rocky shore, with faint building reflections. */}
      <g opacity=".7" strokeWidth="1.2">
        <path d="M32 451L71 419L101 428L141 441L189 412L228 363L286 382L340 370L395 392L457 388L492 412L559 405L604 428L664 415L714 434L780 423L833 439L898 420L956 447L1008 453" />
        <path d="M197 416L221 427L244 459L310 475L381 454L439 479L518 475L574 456L627 480L692 465L756 480L810 464L883 476L932 457 M226 380L255 404L251 425L283 447 M279 388L303 421L342 433 M366 388L386 418L371 441 M433 409L451 435L470 451 M531 417L516 435L540 454 M632 437L650 453 M746 444L768 459 M845 444L875 462" />
        <path d="M101 458H187 M253 487H377 M491 490H553 M682 491H850 M912 484H974 M286 499H326 M581 511H695 M751 506H841" opacity=".45" />
      </g>
    </svg>
  );
}
