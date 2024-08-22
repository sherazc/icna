package org.icna.register.configuration

import com.nimbusds.jose.jwk.source.ImmutableSecret
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.AdviceMode
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain
import javax.crypto.spec.SecretKeySpec

@Configuration
@EnableWebSecurity(debug = true)
@EnableMethodSecurity(
    jsr250Enabled = true,
    prePostEnabled = true,
    securedEnabled = false,
    mode = AdviceMode.PROXY
)
class SecurityConfiguration(@Value("\${jwt.key}")
                            private var jwtKey: String) {

    @Throws(Exception::class)
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { auth ->
                // auth.requestMatchers("/h2-console/**").permitAll()
                   //  .anyRequest().authenticated()
                auth.anyRequest().permitAll()
            }
            .headers { headers -> headers.frameOptions { options -> options.disable() } }
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt ->
                    jwt.jwtAuthenticationConverter(getJwtAuthenticationConverter())
                }
            }
            .httpBasic { }
            .build();
    }

    fun getJwtAuthenticationConverter(): Converter<Jwt, AbstractAuthenticationToken> {
        val converter = JwtAuthenticationConverter()

        converter.setJwtGrantedAuthoritiesConverter { jwt ->
            val scopesString = jwt.getClaim<String>("scope")
            scopesString.split("\\s".toRegex())
                .map { scope -> SimpleGrantedAuthority(scope) }
        }

        return converter
    }


    @Bean
    fun jwtEncoder(): JwtEncoder = NimbusJwtEncoder(ImmutableSecret(jwtKey.toByteArray()))

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val key: ByteArray = jwtKey.toByteArray()
        val originalKey = SecretKeySpec(key, 0, key.size, "RSA")
        return NimbusJwtDecoder.withSecretKey(originalKey).macAlgorithm(MacAlgorithm.HS512).build()
    }
}