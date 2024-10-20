<!-- ===============>> footer start here <<================= -->
<footer class="footer brand-1">
    <div class="container">
        <div class="footer__wrapper">
            <div class="footer__top footer__top--style1">
                <div class="row gy-5 gx-4">
                    <div class="col-md-6">
                        <div class="footer__about">
                            <a href="{{ route('home') }}" class="footer__about-logo">
                                <img class="site-logo" src="{{ asset('assets/images/logoIcon/logo.png') }}"
                                    alt="logo">
                            </a>
                            <p class="footer__about-moto ">Welcome to our trading site! We offer the best, most
                                affordable products and services around. Shop now and start finding great deals!</p>
                            <div class="footer__app">
                                <div class="footer__app-item footer__app-item--apple">
                                    <div class="footer__app-inner">
                                        <div class="footer__app-thumb">
                                            <a href="https://www.apple.com/app-store/" target="_blank"
                                                class="stretched-link">
                                                <img src="{{asset('assets/images/footer/apple.png') }}" alt="apple-icon">
                                            </a>
                                        </div>
                                        <div class="footer__app-content">
                                            <span>Download on the</span>
                                            <p class="mb-0">App Store</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer__app-item footer__app-item--playstore">
                                    <div class="footer__app-inner">
                                        <div class="footer__app-thumb">
                                            <a href="https://play.google.com/store" target="_blank"
                                                class="stretched-link">
                                                <img src="{{asset('assets/images/footer/play.png') }}" alt="playstore-icon">
                                            </a>
                                        </div>
                                        <div class="footer__app-content">
                                            <span>GET IT ON</span>
                                            <p class="mb-0">Google Play</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4 col-6">
                        <div class="footer__links">
                            <div class="footer__links-tittle">
                                <h6>Quick links</h6>
                            </div>
                            <div class="footer__links-content">
                                <ul class="footer__linklist">
                                    <li class="footer__linklist-item"> <a href="#">About Us</a></li>
                                    <li class="footer__linklist-item"> <a href="#">Teams</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    <div class="col-md-2 col-sm-4 col-6">
                        <div class="footer__links">
                            <div class="footer__links-tittle">
                                <h6>Support</h6>
                            </div>
                            <div class="footer__links-content">
                                @php
                                    $links = getContent('policy_pages.element');
                                @endphp
                                <ul class="footer__linklist">
                                    @foreach ($links as $link)
                                        <li class="footer__linklist-item">
                                            <a
                                                href="{{ route('policy.pages', [slug($link->data_values->title), $link->id]) }}">{{ __($link->data_values->title) }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="footer__bottom">
                <div class="footer__end">
                    <div class="footer__end-copyright">
                        <p class=" mb-0">© {{ date('Y') }} All Rights Reserved By <a href="{{ route('home') }}"
                                target="_blank">{{ $general->site_name }}</a> </p>
                    </div>
                    <div>
                        <ul class="social">
                            <li class="social__item">
                                <a href="#" class="social__link social__link--style22"><i
                                        class="fab fa-facebook-f"></i></a>
                            </li>
                            <li class="social__item">
                                <a href="#" class="social__link social__link--style22 "><i
                                        class="fab fa-instagram"></i></a>
                            </li>
                            <li class="social__item">
                                <a href="#" class="social__link social__link--style22"><i
                                        class="fa-brands fa-linkedin-in"></i></a>
                            </li>
                            <li class="social__item">
                                <a href="#" class="social__link social__link--style22"><i
                                        class="fab fa-youtube"></i></a>
                            </li>
                            <li class="social__item">
                                <a href="#" class="social__link social__link--style22 "><i
                                        class="fab fa-twitter"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer__shape">
        <span class="footer__shape-item footer__shape-item--1"><img src="{{asset('assets/images/footer/1.png') }}"
                alt="shape icon"></span>
        <span class="footer__shape-item footer__shape-item--2"> <span></span> </span>
    </div>
</footer>
<!-- ===============>> footer end here <<================= -->