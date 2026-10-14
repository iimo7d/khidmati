# Khidmati Angular Learning and Revision Roadmap

A sequenced study guide for a junior frontend developer, based on the concepts implemented in this project.

## Who This Is For

You should already know basic HTML, CSS, JavaScript functions, arrays, objects, and DOM events. If these are new, study them first; their learning time is not included below.

Choose your track:

- **Revision:** you have used Angular before and need to recall concepts, understand this codebase, and practice weak areas.
- **First-time learning:** you know frontend basics but are new to Angular or have only followed introductory tutorials.

Time estimates are focused study hours, not deadlines. They include reading, tracing project code, small exercises, and checking your understanding. They do not represent a promise of job readiness. Use the higher estimate when TypeScript, RxJS, or forms are unfamiliar.

## Time Budget and Recommended Order

| Stage | Focus | Revision | First-time learning |
| --- | --- | --- | --- |
| 0 | TypeScript prerequisites | 4-6 hours | 12-20 hours |
| 1 | Angular and template foundations | 4-6 hours | 12-18 hours |
| 2 | Component communication and reactive state | 4-6 hours | 12-18 hours |
| 3 | Routing, RxJS, and HTTP | 6-8 hours | 18-26 hours |
| 4 | Forms and user workflows | 6-10 hours | 22-32 hours |
| 5 | Advanced integration and architecture | 6-10 hours | 22-34 hours |
| 6 | Testing, build, and delivery | 4-6 hours | 14-22 hours |
| **Total** | **Core roadmap** | **34-52 hours** | **112-170 hours** |

At **10 focused hours per week**, budget approximately **4-6 weeks for revision** or **12-17 weeks for first-time learning**. At **5 hours per week**, budget approximately **7-11 weeks** or **23-34 weeks** respectively. These are rounded up and exclude breaks and optional work.

You can mix tracks: revise familiar stages and use the learning estimate for unfamiliar ones. Do not move ahead just because the allocated hours have passed; use the checkpoints below.

Numbering follows a prerequisite-based learning sequence, not a ranking of importance. Learn basic testing alongside each stage, then study the testing infrastructure in Stage 6.

## Stage 0: TypeScript Prerequisites

**Time:** revision 4-6 hours; first-time learning 12-20 hours.

1. **Interfaces and object types:** understand service, category, applicant, and request models.
2. **Literal unions and optional properties:** model languages, statuses, delivery methods, and optional data.
3. **Generics and nullability:** understand typed signals, HTTP results, and form controls.
4. **Discriminated unions:** understand why pickup and courier payloads have different required fields.
5. **Supporting language features:** imports/exports, classes, access modifiers, inheritance, array transformations, and immutable object updates.

**Read:** `src/app/core/models/services.model.ts` and `src/app/core/models/requests.model.ts`.

**Practice:** write a small function that accepts `DeliveryDetails` and handles each delivery method using its discriminant. Confirm that accessing courier-only fields without narrowing produces a type error.

**Checkpoint:** explain why a discriminated union describes delivery details more accurately than an object where every field is optional.

## Stage 1: Angular and Template Foundations

**Time:** revision 4-6 hours; first-time learning 12-18 hours.

6. **Application bootstrapping:** `bootstrapApplication`, the root component, and application configuration.
7. **Standalone components:** component-level imports and composing a page from smaller components.
8. **Component anatomy:** `@Component`, selectors, class members, external templates, and component styles.
9. **Template binding:** interpolation, property binding, event binding, class binding, and attribute binding.
10. **Built-in control flow:** `@if`, `@else if`, `@else`, aliases, and `@for` with stable `track` expressions.
11. **Template references:** references such as `#stepper` and date-picker references.
12. **Pipe consumption:** applying translation, date, and currency pipes with arguments. Implementing pipes comes later.

**Read:** `src/main.ts`, `src/app/app.config.ts`, and `src/app/ui/service-card/`.

**Practice:** trace how one service object becomes a rendered card. Identify every binding and explain the branches for a zero fee and same-day processing.

**Checkpoint:** explain property binding versus attribute binding, and why a stable service ID is useful in `@for` tracking.

**Avoid confusion:** a standalone component may import a library NgModule. That does not mean this application defines its own NgModule-based architecture.

## Stage 2: Component Communication and Reactive State

**Time:** revision 4-6 hours; first-time learning 12-18 hours.

13. **Inputs and outputs:** `input()`, `input.required<T>()`, `output()`, and parent event handlers.
14. **Writable signals:** reading signal values and changing state with signal methods.
15. **Computed signals:** derive filtered lists, flags, counts, and lookups without duplicating state.
16. **Effects:** use `effect()` for document and persistence side effects rather than ordinary derived values.
17. **Services and dependency injection:** `@Injectable`, `providedIn: 'root'`, and `inject()`.
18. **State encapsulation:** private writable signals, public read-only views, and methods controlling updates.
19. **Lifecycle and change detection:** `ngOnInit` and the explicit `OnPush` strategy used by multiple components.
20. **Host events:** the layout's `@HostListener('window:scroll')` behavior.

**Read:** `src/app/ui/empty-state/`, `src/app/core/theme/theme.service.ts`, and `src/app/layout/main-layout/main-layout.ts`.

**Practice:** trace an empty-state button click from the child output to its parent handler. Separately trace a theme toggle from the event through the signal to the document effect.

**Checkpoint:** explain when to use a writable signal, a computed signal, an effect, or a service method.

**Avoid confusion:** `input()` creates a signal input; `output()` emits events and is not a signal. The project uses service-based signal state, not NgRx.

## Stage 3: Routing, RxJS, and HTTP

**Time:** revision 6-8 hours; first-time learning 18-26 hours.

21. **Basic routing:** route definitions, nested routes, redirects, wildcards, outlets, links, and active-link state.
22. **Route parameters and navigation:** `:lang`, `:id`, `ActivatedRoute`, and programmatic navigation.
23. **Query parameters as UI state:** synchronize search/category filters with the URL and restore them from it.
24. **Lazy loading:** `loadComponent` and dynamic imports for feature pages.
25. **Observable fundamentals:** subscriptions, emissions, completion, and errors; distinguish streams from current signal values.
26. **RxJS operators used here:** `of`, `map`, `tap`, `delay`, `catchError`, `throwError`, and `EMPTY`.
27. **HTTP:** `provideHttpClient`, `HttpClient.get<T>()`, and runtime JSON loading.
28. **Subscription cleanup:** `DestroyRef` and `takeUntilDestroyed()` for long-lived route/form subscriptions.
29. **Sharing and caching:** `shareReplay(1)`, cached service state, and explicit reload behavior.
30. **Async UI states:** loading, error, retry, empty, and successful data states.

**Read:** `src/app/app.routes.ts`, `src/app/feature/services-catalog/catalog-page/`, and `src/app/core/services-data/services-data.service.ts`.

**Practice:** change catalog filters and inspect the URL. Refresh it and confirm the filter state is restored. In browser developer tools, block the service-data request, observe the error state, unblock it, and retry.

**Checkpoint:** explain the full path from an HTTP response to a service signal, computed filtered list, and rendered card. Explain why `HttpClient.get<T>()` does not validate JSON at runtime.

**Avoid confusion:** the project connects observables and signals through subscriptions and updates; it does not demonstrate `toSignal()`. Lazy loading is implemented with `loadComponent`, not `loadChildren`.

## Stage 4: Forms and User Workflows

**Time:** revision 6-10 hours; first-time learning 22-32 hours.

31. **Basic `ngModel` binding:** catalog search uses `[ngModel]` and `(ngModelChange)`.
32. **Reactive form structure:** `ReactiveFormsModule`, `FormBuilder`, controls, groups, `[formGroup]`, and `formControlName`.
33. **Typed values:** inferred control types, explicit control types, nullability, and `getRawValue()`.
34. **Built-in validation and state:** required, length, email, and confirmation rules; valid/invalid, touched, dirty, and marking fields touched.
35. **Custom synchronous validators:** `ValidatorFn`, `AbstractControl`, and `ValidationErrors` for national ID, mobile, age, and appointment rules.
36. **Dynamic validation:** change pickup/courier validators and recalculate validity.
37. **Form event streams:** `valueChanges` and controlling emissions with `emitEvent: false`.
38. **Multi-step workflows:** Material stepper progression, validation, review, submission state, and success state.
39. **Confirmation dialogs:** `MatDialog`, injected dialog data, dialog references, and `afterClosed()` results.

**Read:** `src/app/feature/apply/apply-page/`, `src/app/core/validators/custom-validators.ts`, and `src/app/pattern/`.

**Practice:** exercise invalid and valid applicant details, switch between pickup and courier, and verify only relevant delivery fields are required. Try leaving an unfinished form, then completing a submission.

**Checkpoint:** explain why changing validators requires updating validity, why hidden controls can still affect form validity, and how the final payload differs by delivery method.

**Avoid confusion:** these are conventional reactive forms, not Angular Signal Forms. The small catalog `ngModel` usage does not demonstrate a complete template-driven form workflow.

## Stage 5: Advanced Integration and Architecture

**Time:** revision 6-10 hours; first-time learning 22-34 hours.

40. **Functional guards:** activation checks, observable results, redirect URL trees, and pending-change protection with `CanDeactivateFn`.
41. **Functional HTTP interceptors:** cloning immutable requests, attaching `Accept-Language`, forwarding requests, and centralized error notification.
42. **Custom pipes:** `PipeTransform`, injected dependencies, and the execution implications of `pure: false`.
43. **Runtime internationalization:** JSON dictionaries, translation caching, parameter replacement, bilingual data, registered locale formatting, and document language/direction.
44. **Framework extension through DI:** `CustomTitleStrategy`, inheritance, overridden methods, and a `useClass` provider.
45. **Material theming and browser APIs:** theme tokens, light/dark themes, `matchMedia`, and localStorage-backed preferences.
46. **Feature-oriented architecture:** responsibilities of `core`, `feature`, `ui`, `layout`, and `pattern`; service facades and separation of concerns.

**Read:** `src/app/core/guards/`, `src/app/core/interceptors/app-http.interceptor.ts`, `src/app/core/i18n/`, and `src/material-theme.scss`.

**Practice:** trace language switching through navigation, translation loading, document direction, formatting, and page titles. Inspect an outgoing request's language header. Explain how the custom title provider replaces framework behavior.

**Checkpoint:** describe which responsibilities belong in a page, reusable UI component, data service, guard, interceptor, or pipe.

**Avoid confusion:**

- These guards implement navigation/business rules, not authentication or backend authorization.
- Internationalization is custom, not `$localize` or `ngx-translate`.
- The folder structure does not prove strict dependency enforcement; UI components do import core translation utilities.
- Services provide facade-style encapsulation. A multi-step form is not automatically the GoF Builder pattern, and an `if` branch is not automatically a formal Strategy implementation.

## Stage 6: Testing, Build, and Delivery

**Time:** revision 4-6 hours; first-time learning 14-22 hours.

47. **Component testing:** `TestBed`, fixtures, input setup, change detection, stability, DOM assertions, clicks, and output emissions.
48. **Service/HTTP testing:** test providers, `HttpTestingController`, expected requests, flushing responses, and verifying outstanding requests.
49. **Behavioral tests:** validator boundaries, search normalization, request transitions, asynchronous observable results with `firstValueFrom`, and Vitest spies.
50. **Build configuration:** development/production modes, source maps, output hashing, static assets, and bundle/style budgets.
51. **SPA hosting:** Netlify/Vercel fallback rewrites for direct access to client-side routes.

**Read:** `src/app/core/services-data/services-data.service.spec.ts`, `src/app/ui/empty-state/empty-state.spec.ts`, `src/app/core/validators/custom-validators.spec.ts`, `angular.json`, `netlify.toml`, and `vercel.json`.

**Practice:** run the existing tests and production build from the application root. Read one component test and one HTTP test, explaining which behavior each assertion proves. In a practice branch, deliberately break a tested behavior, observe the failure, then undo your deliberate change.

**Checkpoint:** explain the difference between a component-creation test and a behavior test, and why passing unit tests does not establish that an entire browser workflow works.

**Avoid confusion:** deployment configuration is not proof of a successful deployment. Existing tests are not proof that all guards, interceptors, localization paths, and workflows have complete coverage.

## Supporting Frontend Topics

These topics occur in the project but are not Angular-specific. Study them alongside the relevant stages.

| Topic | Project example |
| --- | --- |
| Persistence | localStorage serialization, stored preferences, and simulated request persistence |
| Domain modeling | Pickup/courier payloads and submitted/cancelled request states |
| Search normalization | Arabic diacritics and letter normalization |
| Responsive design | Media queries and desktop table/mobile card layouts |
| Accessibility | Semantic landmarks, labels, active links, focus styles, and reduced-motion rules |
| RTL-aware CSS | Logical spacing properties such as `padding-inline-start` |
| Immutable updates | Replacing arrays/objects when updating request state |

For a separate focused pass, allow **3-5 additional revision hours** or **8-12 learning hours**, depending on existing CSS and browser API knowledge.

The requests service simulates backend behavior with localStorage and delayed observables. Do not describe this as experience building a real backend or database integration.

## Suggested Study Routine

For a two-hour session:

1. **20 minutes:** recall the previous topic without notes.
2. **30 minutes:** read the relevant project files and look up unfamiliar Angular APIs in official documentation.
3. **50 minutes:** perform one small exercise or trace one complete workflow.
4. **20 minutes:** explain the result aloud and record unclear points.

Revisit difficult topics after roughly **one day, one week, and one month**. Include short reviews within the study budget; add time if a checkpoint remains unclear.

Keep exercises on a practice branch or in a separate sandbox. The goal is understanding, not changing working project behavior merely to use more APIs.

## Final Practical Review

Allow an optional **3-5 revision hours** or **8-12 learning hours** for this integrated review, beyond the core roadmap.

- Explain application startup and draw the component/service dependencies.
- Trace a catalog request through HTTP, caching, signals, filters, and rendering.
- Demonstrate that filter state can be shared through a URL.
- Complete pickup and courier applications, including invalid-input paths.
- Demonstrate unfinished-form protection and cancellation confirmation.
- Switch language and theme; inspect resulting document attributes/classes.
- Explain and run a component test and an HTTP service test.
- Build the application and explain why SPA hosting requires a route fallback.

**Completion standard:** you can explain these flows, make a small related change without copying blindly, and verify the resulting behavior.

## What To Learn Next, Not What This Project Already Covers

These were not demonstrated in the inspected application source. They are follow-on options, not requirements to add to this project.

1. **Composition:** content projection, view/content queries, custom directives, and dynamic components.
2. **Advanced forms:** `FormArray`, asynchronous validators, and `ControlValueAccessor`.
3. **Advanced RxJS:** `switchMap`, debouncing, cancellation, and higher-order streams.
4. **Additional reactive APIs:** `toSignal`, `toObservable`, `linkedSignal`, resource APIs, and Signal Forms.
5. **Additional template capabilities:** `@switch`, `@defer`, and template outlets.
6. **Production integrations:** real API CRUD, authentication, server-enforced authorization, and end-to-end testing.
7. **Architecture when needed:** NgRx or other store libraries, SSR/prerendering/hydration, and PWA support.

Prioritize advanced RxJS, real API integration, and end-to-end testing before adding architectural libraries solely for practice.

## Scope and Evidence

This roadmap is based on a source/configuration audit of the Angular 22 project. It identifies implemented concepts and proposed learning exercises, not verified runtime correctness. No runtime, build, or test-pass claims are implied by this document. Estimates are educational planning judgments, not measured completion times.

Useful references: [Angular documentation](https://angular.dev), [Reactive forms](https://angular.dev/guide/forms/reactive-forms), and [RxJS interoperability](https://angular.dev/ecosystem/rxjs-interop).
