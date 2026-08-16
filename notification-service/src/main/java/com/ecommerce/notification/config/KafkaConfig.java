package com.ecommerce.notification.config;

import com.ecommerce.common.event.PasswordResetRequestedEvent;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.common.event.UserRegisteredEvent;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    private Map<String, Object> baseConsumerConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "notification-service");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "com.ecommerce.common.event");
        return config;
    }

    @Bean
    ConsumerFactory<String, UserRegisteredEvent> userRegisteredConsumerFactory() {
        Map<String, Object> config = new HashMap<>(baseConsumerConfig());
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, UserRegisteredEvent.class.getName());
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, UserRegisteredEvent> userRegisteredKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, UserRegisteredEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(userRegisteredConsumerFactory());
        return factory;
    }

    @Bean
    ConsumerFactory<String, PasswordResetRequestedEvent> passwordResetConsumerFactory() {
        Map<String, Object> config = new HashMap<>(baseConsumerConfig());
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, PasswordResetRequestedEvent.class.getName());
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, PasswordResetRequestedEvent> passwordResetKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PasswordResetRequestedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(passwordResetConsumerFactory());
        return factory;
    }

    @Bean
    ConsumerFactory<String, PaymentCompletedEvent> paymentCompletedConsumerFactory() {
        Map<String, Object> config = new HashMap<>(baseConsumerConfig());
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, PaymentCompletedEvent.class.getName());
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    ConcurrentKafkaListenerContainerFactory<String, PaymentCompletedEvent> paymentCompletedKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PaymentCompletedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(paymentCompletedConsumerFactory());
        return factory;
    }
}
